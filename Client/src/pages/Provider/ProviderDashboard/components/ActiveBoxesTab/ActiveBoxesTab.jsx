import { useState, useEffect } from 'react'
import './ActiveBoxesTab.css'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoxesByUser, deleteBox } from '../../../../../redux/slices/BoxSlice'
import { fetchCurrentUser } from '../../../../../redux/slices/UserSlice'
import { useToast } from '../../../../../Context/ToastContext'

function ActiveBoxesTab({ onEditBox }) {
    const dispatch = useDispatch()
    const toast = useToast()

    const { currentUser } = useSelector(state => state.user)
    const { boxes, loading } = useSelector(state => state.boxes)

    const [search, setSearch] = useState('')
    const [boxToDelete, setBoxToDelete] = useState(null)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    useEffect(() => {
        dispatch(fetchCurrentUser())
    }, [dispatch])

    useEffect(() => {
        if (currentUser?.id) {
            dispatch(fetchBoxesByUser(currentUser.id))
        }
    }, [currentUser, dispatch])

    const aprobadas = boxes
        .filter(b => b.status === 'APPROVED')
        .map(b => ({
            id: b.id,
            name: b.name || 'Caja de Experiencia',
            sku: `SKU: EX-${b.id}00`,
            categories: b.category ? [b.category.description.toUpperCase()] : ['SIN CATEGORÍA'],
            activations: 0,
            status: 'published',
            price: b.price || 0,
            shortDescription: b.description || '',
        }))

    const filteredBoxes = aprobadas.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.id.toString().includes(search)
    )

    const handleDeleteClick = (box) => {
        if (box.status !== 'published') return
        setBoxToDelete(box)
        setShowConfirmModal(true)
    }

    const handleConfirmDelete = () => {
        if (boxToDelete) {
            dispatch(deleteBox(boxToDelete.id))
                .unwrap()
                .then(() => {
                    setShowConfirmModal(false)
                    setBoxToDelete(null)
                    toast.success('La caja fue removida del catálogo correctamente.')
                })
                .catch((err) => {
                    setShowConfirmModal(false)
                    setBoxToDelete(null)
                    toast.error('No se pudo eliminar la caja de la base de datos.')
                })
        }
    }

    const handleCancelDelete = () => {
        setShowConfirmModal(false)
        setBoxToDelete(null)
    }

    if (loading) return <div style={{ padding: '2rem' }}>Cargando catálogo de experiencias en vivo...</div>

    return (
        <div className="active-boxes">
            <div className="tab-header">
                <h1>Cajas Activas / Publicadas</h1>
                <p>Métricas de tus experiencias actualmente en vivo en BigBox desde MySQL.</p>
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
                            <th>Categorías</th>
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
                                                {box.categories.map((cat) => (
                                                    <span key={cat} className="ab-cat-tag">{cat}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="ab-activations">{box.activations.toLocaleString()}</td>
                                        <td>
                                            <span className={`status-badge ${isActive ? 'status-approved' : 'status-pending'}`}>
                                                {isActive ? '● En línea' : '● Borrador'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="ab-actions-container">
                                                <button className="btn-edit-box" onClick={() => onEditBox && onEditBox(box)}>
                                                    Editar →
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
                    Mostrando {filteredBoxes.length} cajas en el catálogo
                </div>
            </div>

            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-icon-wrapper">
                            <span className="modal-icon">⚠️</span>
                        </div>
                        <h3 className="modal-title">¿Eliminar esta caja definitivamente?</h3>
                        <p className="modal-text">
                            Estás a punto de despublicar <strong>"{boxToDelete?.name}"</strong>. Desaparecerá de inmediato de la vitrina de compras de los clientes.
                        </p>
                        <div className="modal-actions">
                            <button onClick={handleCancelDelete} className="btn-modal-cancel">Cancelar</button>
                            <button onClick={handleConfirmDelete} className="btn-modal-confirm" style={{ backgroundColor: '#d32f2f', color: 'white' }}>
                                Sí, eliminar en BD
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ActiveBoxesTab