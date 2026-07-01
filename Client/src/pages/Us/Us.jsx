import './Us.css'

const team = [
    { name: "Martín Kramer", role: "Frontend Developer", initials: "MK" },
    { name: "Mariano Moretti", role: "Backend Developer", initials: "MM" },
    { name: "German Picas", role: "Full Stack Developer", initials: "GP" }
]

function Us() {
    return (
        <div className="us">

            <section className="nos-hero">
                <h1>Sobre Boxify</h1>
                <p>Redefiniendo el arte de regalar con experiencias curadas y momentos premium.</p>
            </section>

            <section className="nos-mision">
                <div className="nos-mision-content">
                    <h2>Nuestra misión</h2>
                    <p>En Boxify creemos que los mejores regalos no se guardan en cajones: se viven. Por eso creamos una plataforma donde podés encontrar experiencias únicas para cada persona y cada ocasión.</p>
                    <p>Desde una cena en un restaurante de autor hasta una aventura en paracaídas, cada box está cuidadosamente seleccionado para crear recuerdos que duran toda la vida.</p>
                </div>
                <div className="nos-stats">
                    <div className="nos-stat">
                        <span className="nos-stat-number">+500</span>
                        <span>Experiencias disponibles</span>
                    </div>
                    <div className="nos-stat">
                        <span className="nos-stat-number">+10k</span>
                        <span>Clientes felices</span>
                    </div>
                    <div className="nos-stat">
                        <span className="nos-stat-number">24</span>
                        <span>Meses de validez</span>
                    </div>
                </div>
            </section>

            <section className="nos-team">
                <h2>El equipo</h2>
                <p>Grupo 14 — Aplicaciones Interactivas, UADE 2026</p>
                <div className="nos-team-grid">
                    {team.map((member) => (
                        <div key={member.name} className="nos-team-card">
                            <div className="nos-avatar">{member.initials}</div>
                            <h3>{member.name}</h3>
                            <p>{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    )
}

export default Us