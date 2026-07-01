import { useState, useEffect } from 'react'
import './ActiveBoxesTab.css'
import api from '../../../../../api/axiosConfig'
import { useToast } from '../../../../../Context/ToastContext'
import StatusBadge from '../../../../../components/StatusBadge/StatusBadge'
import ConfirmModal from '../../../../../components/ConfirmModal/ConfirmModal'

import { getBoxImageUrl } from '../../../../../utils/boxUtils'

function ActiveBoxesTab({ onEditBox }) {
    const [boxes, setBoxes] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('ACTIVE') // 👈 'ACTIVE' o 'INACTIVE'
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
                    // 👈 Filtramos para quedarnos solo con APPROVED (activas) o REJECTED (inactivas)
                    .filter(b => b.status === 'APPROVED' || b.status === 'REJECTED')
                    .map(b => ({
                        id: b.id,
                        name: b.name || 'Caja de Experiencia',
                        sku: `SKU: EX-${b.id}00`,
                        categories: b.category ? [b.category.description.toUpperCase()] : ['SIN CATEGORIA'],
                        activations: 0,
                        status: b.status === 'APPROVED' ? 'active' : 'inactive', // 👈 Mapeamos a nuevos estados para el Front
                        price: b.price || 0,
                        shortDescription: b.description || '',
                        images: b.images || []
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
        if (box.status !== 'active') return
        setBoxToDelete(box)
    }

    const handleConfirmDelete = () => {
        if (!boxToDelete) return

        // Mantenemos el borrado lógico enviando REJECTED a la base de datos
        api.put(`/api/boxes/${boxToDelete.id}`, { status: 'REJECTED' })
            .then(() => {
                // En lugar de removerla del todo, cambiamos su estado localmente a 'inactive'
                setBoxes(boxes.map(b => b.id === boxToDelete.id ? { ...b, status: 'inactive' } : b))
                setBoxToDelete(null)
                toast.success('La caja fue desactivada del catálogo correctamente.')
            })
            .catch(err => {
                setBoxToDelete(null)
                console.error('Error al dar de baja la caja:', err)
                if (err.response?.status === 403) {
                    toast.error('No tenés permisos para modificar esta caja.')
                } else {
                    toast.error('No se pudo remover la caja del catálogo en vivo.')
                }
            })
    }

    const handleReactivateBox = (box) => {
        // 🟢 Acción inversa: mandamos APPROVED para reactivarla en la base de datos
        api.put(`/api/boxes/${box.id}`, { status: 'APPROVED' })
            .then(() => {
                // Cambiamos el estado local a 'active'
                setBoxes(boxes.map(b => b.id === box.id ? { ...b, status: 'active' } : b))
                toast.success('La caja fue reactivada en el catálogo correctamente.')
            })
            .catch(err => {
                console.error('Error al reactivar la caja:', err)
                if (err.response?.status === 403) {
                    toast.error('No tenés permisos para modificar esta caja.')
                } else {
                    toast.error('No se pudo reactivar la caja.')
                }
            })
    }

    // 👈 Primero filtramos por la pestaña seleccionada (Activa / Inactiva) y después por la barra de búsqueda
    const filteredBoxes = boxes
        .filter(b => filterStatus === 'ACTIVE' ? b.status === 'active' : b.status === 'inactive')
        .filter(b =>
            b.name.toLowerCase().includes(search.toLowerCase()) ||
            b.id.toString().includes(search)
        )

    if (loading) return <div style={{ padding: '2rem' }}>Cargando catalogo de experiencias en vivo...</div>

    return (
        <div className="active-boxes">
            <div className="tab-header">
                <h1>Gestión del Catálogo</h1>
                <p>Administrá y controlá las métricas de tus experiencias en Boxify.</p>
            </div>

            <div className="ab-table-wrapper">
                <div className="ab-table-toolbar" style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                    <input
                        type="text"
                        placeholder="Buscar cajas por nombre o ID..."
                        className="ab-search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    {/* 🟢 Selector de Filtro de Estado */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="ab-search" // Reutiliza tus estilos de input o podés darle uno propio
                        style={{ width: '200px', cursor: 'pointer' }}
                    >
                        <option value="ACTIVE">Cajas Activas</option>
                        <option value="INACTIVE">Cajas Inactivas</option>
                    </select>
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
                                    No se encontraron cajas {filterStatus === 'ACTIVE' ? 'activas' : 'inactivas'} para este criterio.
                                </td>
                            </tr>
                        ) : (
                            filteredBoxes.map((box) => {
                                const isActive = box.status === 'active'
                                return (
                                    <tr key={box.id}>
                                        <td>
                                            <div className="ab-box-info">
                                                <img
                                                    src={getBoxImageUrl(box)}
                                                    alt={box.name}
                                                    className="ab-box-thumb"
                                                    style={{ objectFit: 'cover' }}
                                                />
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
                                            {/* 🟢 Pasamos las etiquetas requeridas: 'Activa' o 'Inactiva' */}
                                            <StatusBadge
                                                status={box.status}
                                                label={isActive ? 'Activa' : 'Inactiva'}
                                            />
                                        </td>
                                        <td>
                                            <div className="ab-actions-container">
                                                {isActive ? (
                                                    <>
                                                        {/* Se mantienen intactos tus dos botones originales */}
                                                        <button className="btn-edit-box" onClick={() => onEditBox && onEditBox(box)}>
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(box)}
                                                            className="btn-delete-box active"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </>
                                                ) : (
                                                    // 🟢 Si está inactiva, se renderiza únicamente el botón de Reactivar
                                                    <button
                                                        className="btn-edit-box"
                                                        style={{ borderColor: '#2e7d32', color: '#2e7d32' }}
                                                        onClick={() => handleReactivateBox(box)}
                                                    >
                                                        Reactivar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>

                <div className="ab-table-footer">
                    Mostrando {filteredBoxes.length} cajas en esta sección.
                </div>
            </div>

            <ConfirmModal
                open={!!boxToDelete}
                title="Desactivar esta caja?"
                message={`Estas a punto de despublicar "${boxToDelete?.name}". Pasará al listado de cajas inactivas.`}
                confirmLabel="Sí, desactivar"
                onConfirm={handleConfirmDelete}
                onCancel={() => setBoxToDelete(null)}
            />
        </div>
    )
}

export default ActiveBoxesTab