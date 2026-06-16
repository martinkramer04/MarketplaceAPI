import { useState, useEffect } from 'react'
import './ActiveBoxesTab.css'
import api from '../../../../../api/axiosConfig' // 🟢 Importamos el Axios centralizado

function ActiveBoxesTab({ onEditBox }) {
    const [boxes, setBoxes] = useState([]) // 🟢 Arranca vacío para llenarse con MySQL
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [boxToDelete, setBoxToDelete] = useState(null)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    useEffect(() => {
        cargarCajas();
    }, []);

    const cargarCajas = () => {
        setLoading(true);

        api.get('/auth/me')
            .then(resUser => {
                const userId = resUser.data.id;
                return api.get(`/api/provider-solicitations/provider/${userId}`);
            })
            .then(resSolicitations => {
                // Filtramos solo las CONFIRMADA (aprobadas por el admin)
                const aprobadas = resSolicitations.data.filter(
                    s => s.solicitationStatus === 'CONFIRMADA'
                );

                const adaptadas = aprobadas.map(s => ({
                    id: s.id,
                    name: s.description?.substring(0, 40) || 'Experiencia Aprobada',
                    sku: `SKU: EX-${s.id}00`,
                    categories: ['APROBADA'],
                    activations: 0,
                    status: 'published',
                    price: 0,
                    shortDescription: s.description || '',
                }));

                setBoxes(adaptadas);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error cargando cajas:', err);
                setLoading(false);
            });
    };
    const handleDeleteClick = (box) => {
        if (box.status !== 'published') return
        setBoxToDelete(box)
        setShowConfirmModal(true)
    }

    // 🟢 2. Conectamos la eliminación real en la base de datos (Impacta en el Explore)
    const handleConfirmDelete = () => {
        if (boxToDelete) {
            api.delete(`/api/boxes/${boxToDelete.id}`)
                .then(() => {
                    // Si el backend borró con éxito, limpiamos el estado en el Front
                    setBoxes(boxes.filter((b) => b.id !== boxToDelete.id));
                    setShowConfirmModal(false);
                    setBoxToDelete(null);
                    alert('La caja fue removida del catálogo de BigBox correctamente.');
                })
                .catch((err) => {
                    console.error("Error al eliminar la caja:", err);
                    alert(err.response?.data?.message || "No se pudo eliminar la caja de la base de datos.");
                    setShowConfirmModal(false);
                    setBoxToDelete(null);
                });
        }
    }

    const handleCancelDelete = () => {
        setShowConfirmModal(false)
        setBoxToDelete(null)
    }

    // Filtrado dinámico por la barra de búsqueda
    const filteredBoxes = boxes.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.id.toString().includes(search)
    )

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
                                                <button
                                                    className="btn-edit-box"
                                                    onClick={() => onEditBox && onEditBox(box)}
                                                >
                                                    Editar →
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteClick(box)}
                                                    disabled={!isActive}
                                                    className={`btn-delete-box ${isActive ? 'active' : 'disabled'}`}
                                                    title={isActive ? "Eliminar de la plataforma" : "Solo se pueden eliminar cajas activas"}
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

            {/* MODAL DE CONFIRMACIÓN DE BORRADO */}
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
                            <button onClick={handleCancelDelete} className="btn-modal-cancel">
                                Cancelar
                            </button>
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

export default ActiveBoxesTab;