import './Stepper.css'

function Stepper({ currentStep }) {
    const steps = [
        { number: 1, label: "Order Summary" },
        { number: 2, label: "Payment" },
        { number: 3, label: "Confirmation" }
    ]

    return (
        <div className="stepper">
            {steps.map((step, index) => (
                <div key={step.number} className="stepper-item">
                    <div className={`stepper-circle ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'done' : ''}`}>
                        {currentStep > step.number ? '✓' : step.number}
                    </div>
                    <span className={`stepper-label ${currentStep === step.number ? 'active' : ''}`}>
                        {step.label}
                    </span>
                    {index < steps.length - 1 && (
                        <div className={`stepper-line ${currentStep > step.number ? 'done' : ''}`} />
                    )}
                </div>
            ))}
        </div>
    )
}

export default Stepper