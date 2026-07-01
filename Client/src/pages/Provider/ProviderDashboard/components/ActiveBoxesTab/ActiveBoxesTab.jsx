import { useState, useEffect } from 'react'
import './ActiveBoxesTab.css'
import api from '../../../../../api/axiosConfig'
import { useToast } from '../../../../../Context/ToastContext'
import StatusBadge from '../../../../../components/StatusBadge/StatusBadge'
import ConfirmModal from '../../../../../components/ConfirmModal/ConfirmModal'

function ActiveBoxesTab({ onEditBox }) {
    const [boxes, setBoxes] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [boxToDelete, setBoxToDelete] = useState(null)

    const toast = useToast()

    useEffect(() => {
        cargarCajas()
    }, [])

    const cargarCajas = () => {
        setLoading(true)
        api.get('/auth/me')
            .then(resUser => api.get(`/api/boxes/user/${resUser.data.id}`))
            .then(resBoxes => {
                const adaptadas = resBoxes.data
                    .filter(b => b.status === 'APPROVED')
                    .map(b => ({
                        id: b.id,
                        name: b.name || 'Caja de Experiencia',
                        sku: `SKU: EX-${b.id}00`,
                        categories: b.category ? [b.category.description.toUpperCase()] : ['SIN CATEGORIA'],
                        activations: 0,
                        status: 'published',
                        price: b.price || 0,
                        shortDescription: b.description || '',
                    }))
                setBoxes(adaptadas)
                setLoading(false)
            })
            .catch(err => {
                console.error('Error cargando cajas:', err)
                setLoading(false)
            })
    }

    const handleDeleteClick = (box) => {
        if (box.status !== 'published') return
        setBoxToDelete(box)
    }

    const handleConfirmDelete = () => {
        if (!boxToDelete) return
        api.delete(`/api/boxes/${boxToDelete.id}`)
            .then(() => {
                setBoxes(boxes.filter(b => b.id !== boxToDelete.id))
                setBoxToDelete(null)
                toast.success('La caja fue removida del catalogo correctamente.')
            })
            .catch(err => {
                setBoxToDelete(null)
                if (err.response?.status === 403) {
                    toast.error('No tenes permisos para eliminar esta caja.')
                } else {
                    toast.error('No se pudo eliminar la caja de la base de datos.')
                }
            })
    }

    const filteredBoxes = boxes.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.id.toString().includes(search)
    )

    if (loading) return <div style={{ padding: '2rem' }}>Cargando catalogo de experiencias en vivo...</div>

    return (
        <div className="active-boxes">
            <div className="tab-header">
                <h1>Cajas Activas / Publicadas</h1>
                <p>Metricas de tus experiencias actualmente en vivo en Boxify desde MySQL.</p>
            </div>

            <div className="ab-table-wrapper">
                <div className="ab-table-toolbar">
                    <input
                        type="text"
                        placeholder="Buscar cajas por nombre o ID..."
                        className="ab-search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <table className="ab-table">
                    <thead>
                        <tr>
                            <th>Experiencia</th>
                            <th>Categorias</th>
                            <th>Activaciones</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBoxes.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
                                    No se encontraron cajas registradas para este criterio.
                                </td>
                            </tr>
                        ) : (
                            filteredBoxes.map((box) => {
                                const isActive = box.status === 'published'
                                return (
                                    <tr key={box.id}>
                                        <td>
                                            <div className="ab-box-info">
                                                <div className="ab-box-thumb" />
                                                <div>
                                                    <strong>{box.name}</strong>
                                                    <p>{box.sku} — <span style={{ color: '#2e7d32', fontWeight: '600' }}>${box.price}</span></p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="ab-categories">
                                                {box.categories.map(cat => (
                                                    <span key={cat} className="ab-cat-tag">{cat}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="ab-activations">{box.activations.toLocaleString()}</td>
                                        <td>
                                            <StatusBadge status={box.status} label={isActive ? 'En linea' : 'Borrador'} />
                                        </td>
                                        <td>
                                            <div className="ab-actions-container">
                                                <button className="btn-edit-box" onClick={() => onEditBox && onEditBox(box)}>
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(box)}
                                                    disabled={!isActive}
                                                    className={`btn-delete-box ${isActive ? 'active' : 'disabled'}`}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>

                <div className="ab-table-footer">
                    Mostrando {filteredBoxes.length} cajas en el catalogo
                </div>
            </div>

            <ConfirmModal
                open={!!boxToDelete}
                title="Eliminar esta caja definitivamente?"
                message={`Estas a punto de despublicar "${boxToDelete?.name}". Desaparecera de inmediato de la vitrina.`}
                confirmLabel="Si, eliminar"
                onConfirm={handleConfirmDelete}
                onCancel={() => setBoxToDelete(null)}
            />
        </div>
    )
}

export default ActiveBoxesTab