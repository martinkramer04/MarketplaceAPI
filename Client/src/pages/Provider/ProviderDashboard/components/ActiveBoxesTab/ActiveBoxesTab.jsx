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
    const [filterStatus, setFilterStatus] = useState('ACTIVE')
    const [boxToDelete, setBoxToDelete] = useState(null)

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
                    .filter(b => b.status === 'APPROVED' || b.status === 'REJECTED')
                    .map(b => ({
                        id: b.id,
                        name: b.name || 'Caja de Experiencia',
                        sku: `SKU: EX-${b.id}00`,
                        categories: b.category ? [b.category.description.toUpperCase()] : ['SIN CATEGORIA'],
                        stock: b.stock ?? 0,
                        status: b.status === 'APPROVED' ? 'active' : 'inactive',
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

        const formData = new FormData();
        formData.append('status', 'REJECTED');

        api.put(`/api/boxes/${boxToDelete.id}`, formData)
            .then(() => {
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
        const formData = new FormData();
        formData.append('status', 'APPROVED');

        api.put(`/api/boxes/${box.id}`, formData)
            .then(() => {
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

    const handleOpenStockInput = (boxId) => {
        setStockEditingId(boxId)
        setStockInputValue('')
    }

    const handleCancelStockInput = () => {
        setStockEditingId(null)
        setStockInputValue('')
    }

    const handleStockInputChange = (e) => {
        const value = e.target.value
        if (value === '' || value === '-' || /^-?\d+$/.test(value)) {
            setStockInputValue(value)
        }
    }

    const handleConfirmStockUpdate = (box) => {
        const amount = parseInt(stockInputValue, 10)

        if (!amount || amount === 0) {
            handleCancelStockInput()
            return
        }

        setSavingStockId(box.id)

        const isReduction = amount < 0
        const absoluteAmount = Math.abs(amount)

        if (isReduction && box.stock - absoluteAmount < 0) {
            toast.error(`No podés restar más stock del disponible (${box.stock}).`)
            setSavingStockId(null)
            handleCancelStockInput()
            return
        }

        const endpoint = isReduction
            ? `/api/boxes/${box.id}/ReduceStock`
            : `/api/boxes/${box.id}/stock`

        api.put(endpoint, { amount: absoluteAmount })
            .then((res) => {
                const nuevoStock = res.data?.stock ?? (isReduction ? box.stock - absoluteAmount : box.stock + absoluteAmount)

                setBoxes(prev =>
                    prev.map(b => b.id === box.id ? { ...b, stock: nuevoStock } : b)
                )

                if (isReduction) {
                    toast.success(`Se restaron ${absoluteAmount} unidades de stock.`)
                } else {
                    toast.success(`Se sumaron ${absoluteAmount} unidades de stock.`)
                }
            })
            .catch(err => {
                console.error('Error actualizando stock:', err)
                if (err.response?.status === 403) {
                    toast.error('No tenés permisos para modificar el stock de esta caja.')
                } else if (err.response?.status === 400 && err.response?.data?.message) {
                    toast.error(err.response.data.message)
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
            handleConfirmStockUpdate(box)
        } else if (e.key === 'Escape') {
            handleCancelStockInput()
        }
    }

    const filteredBoxes = boxes
        .filter(b => filterStatus === 'ACTIVE' ? b.status === 'active' : b.status === 'inactive')
        .filter(b =>
            b.name.toLowerCase().includes(search.toLowerCase()) ||
            b.id.toString().includes(search)
        )

    if (loading) return <div className="tab-loading-state">Cargando catalogo de experiences en vivo...</div>

    return (
        <div className="active-boxes">
            <div className="tab-header">
                <h1>Gestión del Catálogo</h1>
                <p>Administrá y controlá las métricas de tus experiencias en Boxify.</p>
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
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="ab-status-select"
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
                                <td colSpan="5" className="table-empty-message">
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
                                                />
                                                <div>
                                                    <strong>{box.name}</strong>
                                                    <p>{box.sku} — <span className="box-price-tag">${box.price}</span></p>
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
                                            <StatusBadge
                                                status={box.status}
                                                label={isActive ? 'Activa' : 'Inactiva'}
                                            />
                                        </td>
                                        <td>
                                            <div className="ab-actions-container">
                                                {isActive ? (
                                                    <>
                                                        <button className="btn-edit-box" onClick={() => onEditBox && onEditBox(box)}>
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(box)}
                                                            className="btn-delete-box active"
                                                        >
                                                            Eliminar
                                                        </button>

                                                        {isEditingStock ? (
                                                            <div className="ab-stock-input-wrapper">
                                                                <input
                                                                    type="text"
                                                                    autoFocus
                                                                    placeholder="+ / -"
                                                                    value={stockInputValue}
                                                                    onChange={handleStockInputChange}
                                                                    onKeyDown={(e) => handleStockInputKeyDown(e, box)}
                                                                    onBlur={handleCancelStockInput}
                                                                    disabled={isSavingStock}
                                                                    className="ab-stock-field"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onMouseDown={() => handleConfirmStockUpdate(box)}
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
                                                                ± Stock
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <button
                                                        className="btn-reactivate-box"
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