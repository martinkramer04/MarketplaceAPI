import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDiscounts, createDiscount } from '../../../../redux/discountSlice'; // Cambiá a tu discountSlice si corresponde
import './AdminCoupons.css';

function AdminCoupons() {
    const dispatch = useDispatch();
    const { discounts, loading, error, status: fetchStatus } = useSelector((state) => state.discount);

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [percentage, setPercentage] = useState('');

    useEffect(() => {
        if (fetchStatus === 'idle' && dispatch(fetchDiscounts)) {
            dispatch(fetchDiscounts());
        }
    }, [fetchStatus, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !code || !percentage) return;

        dispatch(createDiscount({
            name,
            code: code.toUpperCase().trim(),
            percentage: Number(percentage),
            isActive: true,
            discountType: 'GENERAL'
        }));

        setName('');
        setCode('');
        setPercentage('');
    };

    return (
        <div className="propuestas">
            <div className="admin-tab-header">
                <h1>Gestión de Descuentos</h1>
                <p>Creá y administrá los códigos de beneficios de la plataforma.</p>
            </div>

            <div className="propuestas-body" style={{ flexDirection: 'column', gap: '20px' }}>
                <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', width: '100%', boxSizing: 'border-box' }}>
                    <h3 style={{ margin: '0 0 1rem 0' }}>Nuevo Descuento</h3>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <input type="text" placeholder="Nombre (Ej: Hot Sale)" value={name} onChange={e => setName(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }} />
                        <input type="text" placeholder="Código (Ej: HOT15)" value={code} onChange={e => setCode(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }} />
                        <input type="number" placeholder="Porcentaje %" value={percentage} onChange={e => setPercentage(e.target.value)} required min="1" max="100" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '120px' }} />
                        <button type="submit" className="btn-approve" style={{ height: '38px' }}>Crear</button>
                    </div>
                </form>

                <div className="propuestas-table-wrapper" style={{ width: '100%' }}>
                    <table className="propuestas-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Código</th>
                                <th>Descuento</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!discounts || discounts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                                        No hay descuentos registrados.
                                    </td>
                                </tr>
                            ) : (
                                discounts.map((d) => (
                                    <tr key={d.id}>
                                        <td>#{d.id}</td>
                                        <td>{d.name}</td>
                                        <td><code style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{d.code}</code></td>
                                        <td>{d.percentage}% OFF</td>
                                        <td>
                                            <span className={`status-badge ${d.isActive ? 'approved' : 'rejected'}`}>
                                                {d.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
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

export default AdminCoupons;