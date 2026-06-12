import './Profile.css'
import { useState, useEffect } from 'react'

function Profile() {
    const [user, setUser] = useState(null)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const token = sessionStorage.getItem('access_token')

    useEffect(() => {
        // Fetch datos del usuario logueado
        fetch('http://localhost:4002/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error(`Error ${res.status}`)
                return res.json()
            })
            .then(data => {
                setUser(data)
                setLoading(false)

                // Una vez que tenemos el id del usuario, buscamos sus órdenes
                return fetch(`http://localhost:4002/api/orders/user/${data.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            })
            .then(res => {
                if (!res.ok) throw new Error(`Error órdenes ${res.status}`)
                return res.json()
            })
            .then(ordersData => setOrders(ordersData))
            .catch(err => {
                console.error('Error al cargar perfil:', err)
                setError('No se pudieron cargar los datos del perfil.')
                setLoading(false)
            })
    }, [])

    // Iniciales del avatar
    const getInitials = (firstname, lastname) => {
        return `${firstname?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase()
    }

    if (loading) return <p className="loading-msg">Cargando perfil...</p>
    if (error) return <p className="error-msg">{error}</p>
    if (!user) return null

    return (
        <div className="perfil">

            <div className="perfil-header">
                <div className="perfil-avatar">
                    {getInitials(user.firstname, user.lastname)}
                </div>
                <div className="perfil-info">
                    <h1>{user.firstname} {user.lastname}</h1>
                    <p>{user.email}</p>
                    <span className="perfil-since">
                        {user.role === 'ADMIN' && '👑 Administrador'}
                        {user.role === 'PROVIDER' && '🏢 Proveedor'}
                        {user.role === 'USER' && '👤 Usuario'}
                    </span>
                </div>
            </div>

            <div className="perfil-body">

                {/* PEDIDOS */}
                <section className="perfil-orders">
                    <h2>Mis pedidos</h2>

                    {orders.length === 0 ? (
                        <p className="perfil-no-orders">Todavía no tenés pedidos realizados.</p>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="perfil-order-item">
                                <div className="order-info">
                                    <span className="order-id">#{order.id}</span>
                                    {/* boxName está dentro de orderDetails[0] */}
                                    <h3>{order.orderDetails?.[0]?.boxName || 'Pedido'}</h3>
                                    {/* Si hay más de un producto en la orden los mostramos */}
                                    {order.orderDetails?.length > 1 && (
                                        <span className="order-extra">
                                            +{order.orderDetails.length - 1} producto(s) más
                                        </span>
                                    )}
                                </div>
                                <div className="order-right">
                                    <span className={`order-status ${order.status === 'ACTIVE' ? 'status-active' : 'status-used'}`}>
                                        {order.status === 'ACTIVE' ? 'Activo' : 'Canjeado'}
                                    </span>
                                    <span className="order-price">${order.totalAmount}.00</span>
                                </div>
                            </div>
                        ))
                    )}
                </section>

                {/* DATOS */}
                <section className="perfil-datos">
                    <h2>Mis datos</h2>
                    <div className="perfil-campo">
                        <label>Nombre</label>
                        <input type="text" defaultValue={user.firstname} />
                    </div>
                    <div className="perfil-campo">
                        <label>Apellido</label>
                        <input type="text" defaultValue={user.lastname} />
                    </div>
                    <div className="perfil-campo">
                        <label>Email</label>
                        <input type="text" defaultValue={user.email} />
                    </div>
                    <div className="perfil-campo">
                        <label>Contraseña</label>
                        <input type="password" defaultValue="••••••••" />
                    </div>
                    <div className="perfil-campo">
                        <label>Rol</label>
                        <input type="text" defaultValue={user.role} disabled />
                    </div>
                    <button className="btn-guardar">Guardar cambios</button>
                </section>

            </div>

        </div>
    )
}

export default Profile