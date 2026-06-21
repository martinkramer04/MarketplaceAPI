import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { validateDiscount, clearDiscount } from '../../redux/discountSlice'
import './OrderPanel.css'

/**
 * Shared right-side order summary panel used across the checkout flow.
 *
 * Props:
 *   items         – array of { id, name, price, quantity, image? }
 *   extraRows     – array of { label, value, free? } displayed between subtotal and total
 *   showCouponInput – render the coupon input (only OrderSummary page)
 *   totalOverride – use this value instead of computing from items (Confirmation page)
 *   footer        – JSX or function (total) => JSX rendered below the total row
 */
export default function OrderPanel({
    items = [],
    extraRows = [],
    showCouponInput = false,
    totalOverride,
    footer,
}) {
    const dispatch = useDispatch()
    const { discount, loading: couponLoading, error: couponError } = useSelector(
        (state) => state.discount
    )
    const [couponCode, setCouponCode] = useState('')

    const subtotal = items.reduce(
        (acc, item) => acc + (item.price ?? 0) * (item.quantity ?? 1),
        0
    )
    const discountAmount = discount ? (subtotal * discount.percentage) / 100 : 0
    const extraSum = extraRows.reduce((acc, row) => acc + (row.value ?? 0), 0)
    const total = totalOverride ?? subtotal + extraSum - discountAmount

    const handleApplyCoupon = () => {
        const code = couponCode.trim().toUpperCase()
        if (code) dispatch(validateDiscount(code))
    }

    const handleRemoveCoupon = () => {
        dispatch(clearDiscount())
        setCouponCode('')
    }

    const renderedFooter =
        typeof footer === 'function' ? footer({ total, subtotal, discountAmount }) : footer

    return (
        <div className="order-panel">
            <h3 className="op-title">Resumen del pedido</h3>

            {/* Item list */}
            {items.length > 0 && (
                <div className="op-items">
                    {items.map((item, i) => (
                        <div key={item.id ?? i} className="op-item">
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="op-item-img"
                                />
                            )}
                            <div className="op-item-info">
                                <strong>{item.name}</strong>
                                {(item.quantity ?? 1) > 1 && (
                                    <span className="op-item-qty">x{item.quantity}</span>
                                )}
                                <span className="op-item-price">
                                    ${((item.price ?? 0) * (item.quantity ?? 1)).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Coupon — only OrderSummary renders this */}
            {showCouponInput && (
                <div className="op-coupon">
                    <p className="op-coupon-label">Codigo de promocion</p>
                    {!discount ? (
                        <div className="op-coupon-input">
                            <input
                                type="text"
                                placeholder="Ingrese el codigo"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                disabled={couponLoading}
                            />
                            <button onClick={handleApplyCoupon} disabled={couponLoading}>
                                {couponLoading ? 'Validando...' : 'Aplicar'}
                            </button>
                        </div>
                    ) : (
                        <div className="op-coupon-applied">
                            <span>
                                <strong>{discount.code}</strong> &mdash; {discount.percentage}% off
                            </span>
                            <button className="op-coupon-remove" onClick={handleRemoveCoupon}>
                                &#x2715;
                            </button>
                        </div>
                    )}
                    {couponError && <p className="op-coupon-error">{couponError}</p>}
                    {discount && (
                        <p className="op-coupon-success">
                            Cupon aplicado! Descuento del {discount.percentage}%
                        </p>
                    )}
                </div>
            )}

            <hr className="op-divider" />

            {/* Summary rows */}
            <div className="op-rows">
                <div className="op-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                {extraRows.map((row, i) => (
                    <div key={i} className="op-row">
                        <span>{row.label}</span>
                        <span className={row.free ? 'op-free' : ''}>
                            {row.free ? 'Free' : `$${(row.value ?? 0).toFixed(2)}`}
                        </span>
                    </div>
                ))}
                {discount && (
                    <div className="op-row op-discount-row">
                        <span>
                            Descuento ({discount.code} &mdash; {discount.percentage}%)
                        </span>
                        <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                )}
            </div>

            <div className="op-total">
                <span>Total</span>
                <span>
                    ${typeof total === 'number' ? total.toFixed(2) : total}
                </span>
            </div>

            {renderedFooter && <div className="op-footer">{renderedFooter}</div>}
        </div>
    )
}