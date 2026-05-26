import './Profile.css'

const user = {
    name: "Juan García",
    email: "juan.garcia@email.com",
    initials: "JG",
    memberSince: "Enero 2025",
    orders: [
        { id: "#EXP-1023", name: "Gourmet Escape", date: "10 May 2026", status: "Activo", price: 149 },
        { id: "#EXP-0891", name: "Wellness Retreat", date: "02 Mar 2026", status: "Canjeado", price: 199 },
    ]
}

function Profile() {
    return (
        <div className="perfil">

            <div className="perfil-header">
                <div className="perfil-avatar">{user.initials}</div>
                <div className="perfil-info">
                    <h1>{user.name}</h1>
                    <p>{user.email}</p>
                    <span className="perfil-since">Miembro desde {user.memberSince}</span>
                </div>
            </div>

            <div className="perfil-body">

                <section className="perfil-orders">
                    <h2>Mis pedidos</h2>
                    {user.orders.map((order) => (
                        <div key={order.id} className="perfil-order-item">
                            <div className="order-info">
                                <span className="order-id">{order.id}</span>
                                <h3>{order.name}</h3>
                                <span className="order-date">{order.date}</span>
                            </div>
                            <div className="order-right">
                                <span className={`order-status ${order.status === 'Activo' ? 'status-active' : 'status-used'}`}>
                                    {order.status}
                                </span>
                                <span className="order-price">${order.price}.00</span>
                            </div>
                        </div>
                    ))}
                </section>

                <section className="perfil-datos">
                    <h2>Mis datos</h2>
                    <div className="perfil-campo">
                        <label>Nombre completo</label>
                        <input type="text" defaultValue={user.name} />
                    </div>
                    <div className="perfil-campo">
                        <label>Email</label>
                        <input type="text" defaultValue={user.email} />
                    </div>
                    <div className="perfil-campo">
                        <label>Contraseña</label>
                        <input type="password" defaultValue="••••••••" />
                    </div>
                    <button className="btn-guardar">Guardar cambios</button>
                </section>

            </div>

        </div>
    )
}

export default Profile