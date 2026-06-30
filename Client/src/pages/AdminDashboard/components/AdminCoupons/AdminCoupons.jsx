import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDiscounts, createDiscount, updateDiscount } from '../../../../redux/discountSlice';
import { useToast } from '../../../../Context/ToastContext';
import './AdminCoupons.css';

function AdminCoupons() {
    const dispatch = useDispatch();
    const toast = useToast();

    const { discounts, loading, status: fetchStatus } = useSelector((state) => state.discount);

    // Estados del formulario
    const [name, setName] = useState('');
    const [percentage, setPercentage] = useState('');
    const [discountType, setDiscountType] = useState('CUPON');
    const [code, setCode] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Estados para el Panel de Detalle Lateral (Basado en BoxesSolicitations)
    const [activeId, setActiveId] = useState(null);

    // Estados del Modal de Confirmación
    const [showModal, setShowModal] = useState(false);
    const [discountToDisable, setDiscountToDisable] = useState(null);

    useEffect(() => {
        if (fetchStatus === 'idle') {
            dispatch(fetchDiscounts());
        }
    }, [fetchStatus, dispatch]);

    // Buscamos el beneficio seleccionado para mostrar en el panel lateral
    const activeDiscount = discounts.find(d => d.id === activeId) ?? null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !percentage || !discountType) return;

        const payload = {
            name: name.trim(),
            percentage: Number(percentage),
            isActive: true,
            discountType: discountType,
            code: discountType === 'CUPON' ? code.toUpperCase().trim() : null,
            startDate: startDate ? startDate : null,
            endDate: endDate ? endDate : null
        };

        try {
            await dispatch(createDiscount(payload)).unwrap();
            toast.success(`Descuento "${name}" creado exitosamente.`);
            setName(''); setPercentage(''); setCode(''); setStartDate(''); setEndDate('');
        } catch (err) {
            toast.error(`Error al crear descuento: ${typeof err === 'string' ? err : 'Verifique los campos.'}`);
        }
    };

    const handleToggleStatus = (discount) => {
        if (discount.isActive) {
            setDiscountToDisable(discount);
            setShowModal(true);
        } else {
            executeStatusChange(discount, true);
        }
    };

    const executeStatusChange = async (discount, newStatus) => {
        try {
            await dispatch(updateDiscount({
                id: discount.id,
                payload: { ...discount, isActive: newStatus }
            })).unwrap();

            if (newStatus) {
                toast.success(`El beneficio "${discount.name}" fue reactivado.`);
            } else {
                toast.success(`El beneficio "${discount.name}" ha sido desactivado.`);
            }
        } catch (err) {
            toast.error("No se pudo modificar el estado del beneficio.");
        } finally {
            setShowModal(false);
            setDiscountToDisable(null);
        }
    };

    if (loading && (!discounts || !discounts.length)) return <p style={{ padding: '2rem' }}>Cargando beneficios...</p>;

    return (
        <div className="propuestas">
            <div className="admin-tab-header">
                <h1>Gestión de Descuentos</h1>
                <p>Creá beneficios de tipo generales o cupones de descuento específicos para tus clientes.</p>
            </div>

            <div className="propuestas-body">
                {/* CONTENEDOR PRINCIPAL IZQUIERDO */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: activeDiscount ? '65%' : '100%', transition: 'all 0.3s ease' }}>

                    {/* FORMULARIO */}
                    <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxSizing: 'border-box', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 16px 0', color: '#232a3b' }}>Nuevo Descuento / Cupón</h3>

                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                            <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#555' }}>Nombre Comercial</label>
                                <input type="text" placeholder="Ej: Hot Sale 2026" value={name} onChange={e => setName(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>

                            <div style={{ flex: '1 1 140px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#555' }}>Tipo</label>
                                <select value={discountType} onChange={e => setDiscountType(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}>
                                    <option value="CUPON">Cupón (Código)</option>
                                    <option value="GENERAL">General</option>
                                </select>
                            </div>

                            {discountType === 'CUPON' && (
                                <div style={{ flex: '1 1 130px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#555' }}>Código</label>
                                    <input type="text" placeholder="Ej: BIG15" value={code} onChange={e => setCode(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>
                            )}

                            <div style={{ flex: '1 1 80px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#555' }}>% Off</label>
                                <input type="number" placeholder="15" value={percentage} onChange={e => setPercentage(e.target.value)} required min="1" max="100" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>

                            <div style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#555' }}>Desde</label>
                                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required style={{ padding: '7px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>

                            <div style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#555' }}>Hasta</label>
                                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required style={{ padding: '7px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>

                            <button type="submit" className="btn-approve" style={{ height: '36px', padding: '0 16px', fontWeight: 'bold' }}>
                                Guardar
                            </button>
                        </div>
                    </form>

                    {/* TABLA DE BENEFICIOS */}
                    <div className="propuestas-table-wrapper">
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
                                            No hay beneficios registrados.
                                        </td>
                                    </tr>
                                ) : (
                                    discounts.map((d) => (
                                        <tr
                                            key={d.id}
                                            className={activeId === d.id ? 'row-selected' : ''}
                                            onClick={() => setActiveId(d.id === activeId ? null : d.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td>#{d.id}</td>
                                            <td><strong>{d.name}</strong></td>
                                            <td>
                                                {d.code ? <code className="discount-code-badge">{d.code}</code> : <span style={{ color: '#aaa' }}>—</span>}
                                            </td>
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

                {/* 👇 PANEL DETALLE LATERAL (Mismo formato estricto que BoxesSolicitations) */}
                {activeDiscount && (
                    <div className="propuesta-detail" style={{ flex: '0 0 32%', animation: 'fadeIn 0.2s ease-out' }}>
                        <div className="propuesta-detail-header">
                            <h3>{activeDiscount.name}</h3>
                            <button className="btn-close-detail" onClick={() => setActiveId(null)}>✕</button>
                        </div>

                        <div className="propuesta-detail-body">
                            <div className="pd-row">
                                <span>ID del Beneficio</span>
                                <strong>#{activeDiscount.id}</strong>
                            </div>
                            <div className="pd-row">
                                <span>Estado de Aplicación</span>
                                <span className={`status-badge ${activeDiscount.isActive ? 'approved' : 'rejected'}`}>
                                    {activeDiscount.isActive ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                            <div className="pd-row">
                                <span>Tipo de Descuento</span>
                                <strong style={{ textTransform: 'uppercase', fontSize: '0.9rem', color: '#4a5568' }}>{activeDiscount.discountType}</strong>
                            </div>
                            <div className="pd-row">
                                <span>Valor de Deducción</span>
                                <strong style={{ color: '#2f855a' }}>{activeDiscount.percentage}% OFF</strong>
                            </div>
                            {activeDiscount.code && (
                                <div className="pd-row">
                                    <span>Código Clave</span>
                                    <code style={{ background: '#eaf2ff', color: '#2b6cb0', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                                        {activeDiscount.code}
                                    </code>
                                </div>
                            )}
                            <div className="pd-row">
                                <span>Fecha de Lanzamiento</span>
                                <strong>{activeDiscount.startDate ? new Date(activeDiscount.startDate).toLocaleDateString('es-AR') : 'Inmediata'}</strong>
                            </div>
                            <div className="pd-row">
                                <span>Fecha de Vencimiento</span>
                                <strong>{activeDiscount.endDate ? new Date(activeDiscount.endDate).toLocaleDateString('es-AR') : 'Sin Límite Temporal'}</strong>
                            </div>
                        </div>

                        <div className="propuesta-detail-actions" style={{ marginTop: 'auto', padding: '1rem 0 0 0', borderTop: '1px solid #edf2f7' }}>
                            <button
                                className={activeDiscount.isActive ? "btn-reject-full" : "btn-approve-full"}
                                onClick={(e) => { e.stopPropagation(); handleToggleStatus(activeDiscount); }}
                            >
                                {activeDiscount.isActive ? 'Desactivar Beneficio' : 'Reactivar Beneficio'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL CONFIRMACIÓN */}
            {showModal && discountToDisable && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal">
                        <div className="custom-modal-header">
                            <h2>Confirmar Acción</h2>
                        </div>
                        <div className="custom-modal-body">
                            <p>¿Está seguro de que desea desactivar el beneficio <strong>"{discountToDisable.name}"</strong>?</p>
                            <span className="modal-warning-subtext">(Los usuarios ya no podrán aplicar este descuento)</span>
                        </div>
                        <div className="custom-modal-actions">
                            <button className="btn-modal-cancel" onClick={() => { setShowModal(false); setDiscountToDisable(null); }}>Cancelar</button>
                            <button className="btn-modal-confirm" onClick={() => executeStatusChange(discountToDisable, false)}>Confirmar Desactivación</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminCoupons;