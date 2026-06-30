import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBoxes, updateBox } from '../../../../redux/boxSlice';
import './AdminBoxes.css';

function AdminBoxes() {
    const dispatch = useDispatch();
    // Tu slice guarda la lista en 'items'
    const { items: boxes, loading, error, status: fetchStatus } = useSelector((state) => state.boxes);

    useEffect(() => {
        if (fetchStatus === 'idle') dispatch(fetchBoxes());
    }, [fetchStatus, dispatch]);

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que deseas desactivar esta caja?')) {
            // Mandamos payload con active false respetando el boolean primitivo
            dispatch(updateBox({ id, payload: { isActive: false } }));
        }
    };

    if (loading && (!boxes || !boxes.length)) return <p style={{ padding: '2rem' }}>Cargando cajas...</p>;
    if (error && (!boxes || !boxes.length)) return <p style={{ padding: '2rem', color: 'red' }}>Error: {error}</p>;

    return (
        <div className="propuestas">
            <div className="admin-tab-header">
                <h1>Cajas Publicadas</h1>
                <p>Gestioná las cajas que actualmente están activas en la aplicación.</p>
            </div>
            <div className="propuestas-body">
                <div className="propuestas-table-wrapper" style={{ width: '100%' }}>
                    <table className="propuestas-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!boxes || boxes.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                                        No hay cajas publicadas.
                                    </td>
                                </tr>
                            ) : (
                                boxes.map((box) => (
                                    <tr key={box.id}>
                                        <td>#{box.id}</td>
                                        <td><strong>{box.name}</strong></td>
                                        <td>ARS ${Number(box.price).toLocaleString('es-AR')}</td>
                                        <td>
                                            <button
                                                className="btn-reject"
                                                style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                                                onClick={() => handleDelete(box.id)}
                                            >
                                                Desactivar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminBoxes;