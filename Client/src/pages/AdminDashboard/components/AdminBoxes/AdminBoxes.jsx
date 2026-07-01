import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBoxes, updateBox } from '../../../../redux/boxSlice';
import { useToast } from '../../../../Context/ToastContext';
import './AdminBoxes.css';

function AdminBoxes() {
    const dispatch = useDispatch();
    const toast = useToast();

    const { items: boxes, loading, error, status: fetchStatus } = useSelector((state) => state.boxes);

    const [showModal, setShowModal] = useState(false);
    const [boxToHide, setBoxToHide] = useState(null);

    useEffect(() => {
        if (fetchStatus === 'idle') dispatch(fetchBoxes());
    }, [fetchStatus, dispatch]);

    const handleButtonClick = (box) => {
        const isCurrentlyApproved = box.status === 'APPROVED';

        if (isCurrentlyApproved) {
            setBoxToHide(box);
            setShowModal(true);
        } else {
            executeStatusChange(box, 'APPROVED');
        }
    };

    const executeStatusChange = async (box, newStatus) => {
        try {
            await dispatch(updateBox({
                id: box.id,
                fields: {
                    status: newStatus
                }
            })).unwrap();

            if (newStatus === 'APPROVED') {
                toast.success(`La caja "${box.name}" fue reactivada con éxito.`);
            } else {
                toast.success(`La caja "${box.name}" ha sido desactivada.`);
            }
        } catch (err) {
            toast.error(`Error al modificar el estado: ${typeof err === 'string' ? err : 'Intente de nuevo.'}`);
        } finally {
            setShowModal(false);
            setBoxToHide(null);
        }
    };

    if (loading && (!boxes || !boxes.length)) return <p className="boxes-loading">Cargando cajas...</p>;
    if (error && (!boxes || !boxes.length)) return <p className="boxes-error">Error: {error}</p>;

    return (
        <div className="propuestas">
            <div className="admin-tab-header">
                <h1>Cajas Publicadas</h1>
                <p>Gestioná el catálogo disponible. Activá o desactivá cajas para controlar su visibilidad en el frontend.</p>
            </div>

            <div className="propuestas-body">
                <div className="propuestas-table-wrapper full-width">
                    <table className="propuestas-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!boxes || boxes.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="table-empty-message">
                                        No hay cajas publicadas.
                                    </td>
                                </tr>
                            ) : (
                                boxes.map((box) => {
                                    const isBoxActive = box.status === 'APPROVED';
                                    return (
                                        <tr key={box.id}>
                                            <td>#{box.id}</td>
                                            <td><strong>{box.name}</strong></td>
                                            <td>ARS ${Number(box.price).toLocaleString('es-AR')}</td>
                                            <td>
                                                <span className={`status-badge ${isBoxActive ? 'approved' : 'rejected'}`}>
                                                    {isBoxActive ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className={`btn-action ${isBoxActive ? "btn-reject" : "btn-approve"}`}
                                                    onClick={() => handleButtonClick(box)}
                                                >
                                                    {isBoxActive ? 'Desactivar' : 'Reactivar'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && boxToHide && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal">
                        <div className="custom-modal-header">
                            <h2>Confirmar Acción</h2>
                        </div>
                        <div className="custom-modal-body">
                            <p>¿Está seguro de que desea desactivar la caja <strong>"{boxToHide.name}"</strong>?</p>
                            <span className="modal-warning-subtext">(Esta caja dejará de ser visible para los clientes)</span>
                        </div>
                        <div className="custom-modal-actions">
                            <button
                                className="btn-modal-cancel"
                                onClick={() => { setShowModal(false); setBoxToHide(null); }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn-modal-confirm"
                                onClick={() => executeStatusChange(boxToHide, 'REJECTED')}
                            >
                                Confirmar Desactivación
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminBoxes;