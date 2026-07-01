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

    // 👇 NUEVO: controla qué fila tiene el input de "sumar stock" abierto y su valor
    const [stockEditingId, setStockEditingId] = useState(null)
    const [stockInputValue, setStockInputValue] = useState('')
    const [savingStockId, setSavingStockId] = useState(null)

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
                        stock: b.stock ?? 0, // 👈 NUEVO: stock real que devuelve el backend
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

    // 👇 NUEVO: abre el input de stock para esa fila puntual
    const handleOpenStockInput = (boxId) => {
        setStockEditingId(boxId)
        setStockInputValue('')
    }

    // 👇 NUEVO: cierra el input sin guardar (blur, cancelar, etc.)
    const handleCancelStockInput = () => {
        setStockEditingId(null)
        setStockInputValue('')
    }

    // 👇 NUEVO: solo permite dígitos en el input
    const handleStockInputChange = (e) => {
        const value = e.target.value
        if (value === '' || /^\d+$/.test(value)) {
            setStockInputValue(value)
        }
    }

    // 👇 NUEVO: confirma el incremento usando el endpoint dedicado PATCH /api/boxes/{id}/stock
    const handleConfirmStockAdd = (box) => {
        const amount = parseInt(stockInputValue, 10)
        if (!amount || amount <= 0) {
            handleCancelStockInput()
            return
        }

        setSavingStockId(box.id)
        api.put(`/api/boxes/${box.id}/stock`, { amount })
            .then((res) => {
                const nuevoStock = res.data?.stock ?? (box.stock + amount)
                setBoxes(prev =>
                    prev.map(b => b.id === box.id ? { ...b, stock: nuevoStock } : b)
                )
                toast.success(`Se sumaron ${amount} unidades de stock.`)
            })
            .catch(err => {
                console.error('Error actualizando stock:', err)
                if (err.response?.status === 403) {
                    toast.error('No tenés permisos para modificar el stock de esta caja.')
                } else if (err.response?.status === 404) {
                    toast.error('El endpoint de stock no existe en el backend todavía.')
                } else {
                    toast.error('No se pudo actualizar el stock en la base de datos.')
                }
            })
            .finally(() => {
                setSavingStockId(null)
                handleCancelStockInput()
            })
    }

    const handleStockInputKeyDown = (e, box) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleConfirmStockAdd(box)
        } else if (e.key === 'Escape') {
            handleCancelStockInput()
        }
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
                            <th>Stock</th>
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
                                const isEditingStock = stockEditingId === box.id
                                const isSavingStock = savingStockId === box.id
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
                                        <td className="ab-activations">{box.stock.toLocaleString()}</td>
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

                                                        {/* 👇 NUEVO: botón / input para sumar stock. Solo tiene sentido en cajas activas */}
                                                        {isEditingStock ? (
                                                            <div className="ab-stock-input-wrapper" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                                                <input
                                                                    type="text"
                                                                    inputMode="numeric"
                                                                    autoFocus
                                                                    placeholder="Cant."
                                                                    value={stockInputValue}
                                                                    onChange={handleStockInputChange}
                                                                    onKeyDown={(e) => handleStockInputKeyDown(e, box)}
                                                                    onBlur={handleCancelStockInput}
                                                                    disabled={isSavingStock}
                                                                    style={{ width: '60px', padding: '4px 6px', border: '1px solid #ccc', borderRadius: '4px' }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    // onMouseDown en vez de onClick para que dispare antes del onBlur del input
                                                                    onMouseDown={() => handleConfirmStockAdd(box)}
                                                                    disabled={isSavingStock}
                                                                    className="btn-add-stock-confirm"
                                                                >
                                                                    {isSavingStock ? '...' : '✓'}
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenStockInput(box.id)}
                                                                className="btn-add-stock"
                                                            >
                                                                + Stock
                                                            </button>
                                                        )}
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