import './HowItWorks.css'

const steps = [
    {
        number: "01",
        title: "Elegí tu experiencia",
        description: "Explorá nuestra selección de boxes curados: gastronomía, aventura, bienestar, estadías y más. Filtrá por categoría, precio u ocasión."
    },
    {
        number: "02",
        title: "Comprá y recibí tu box",
        description: "Realizá el pago de forma segura. Podés elegir entre entrega digital instantánea o una caja física premium enviada a domicilio."
    },
    {
        number: "03",
        title: "Canjeá cuando quieras",
        description: "El destinatario elige la experiencia dentro del box y reserva cuando mejor le venga. Válido por 24 meses."
    },
    {
        number: "04",
        title: "Viví la experiencia",
        description: "Disfrutá momentos únicos e inolvidables. Porque los mejores regalos no se guardan, se viven."
    }
]

function HowItWorks() {
    return (
        <div className="como-funciona">

            <section className="cf-hero">
                <h1>¿Cómo funciona Boxify?</h1>
                <p>Regalar experiencias nunca fue tan fácil. En cuatro simples pasos.</p>
            </section>

            <section className="cf-steps">
                {steps.map((step) => (
                    <div key={step.number} className="cf-step">
                        <span className="cf-step-number">{step.number}</span>
                        <h2>{step.title}</h2>
                        <p>{step.description}</p>
                    </div>
                ))}
            </section>

        </div>
    )
}

export default HowItWorks