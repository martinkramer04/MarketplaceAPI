import './SystemConfiguration.css'
import { useState } from 'react'

function SystemConfiguration() {
    const [config, setConfig] = useState({
        platformName: 'BigBox',
        maintenanceMode: false,
        maxBoxPrice: 500,
        commissionRate: 15,
        allowNewProviders: true,
        notifyOnNewProposal: true,
    })

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setConfig({ ...config, [e.target.name]: value })
    }

    const handleSave = () => {
        alert('Configuración guardada correctamente.')
    }

    return (
        <div className="config-sistema">

            <div className="admin-tab-header">
                <h1>Configuración del Sistema</h1>
                <p>Ajustes generales de la plataforma BigBox.</p>
            </div>

            <div className="config-body">

                <div className="config-card">
                    <h2>General</h2>

                    <div className="config-campo">
                        <label>Nombre de la Plataforma</label>
                        <input
                            name="platformName"
                            value={config.platformName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="config-campo">
                        <label>Precio Máximo de Caja (USD)</label>
                        <input
                            name="maxBoxPrice"
                            type="number"
                            value={config.maxBoxPrice}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="config-campo">
                        <label>Comisión de Plataforma (%)</label>
                        <input
                            name="commissionRate"
                            type="number"
                            value={config.commissionRate}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="config-card">
                    <h2>Opciones del Sistema</h2>

                    <div className="config-toggle-item">
                        <div>
                            <strong>Modo Mantenimiento</strong>
                            <p>Deshabilita el acceso público a la plataforma.</p>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                name="maintenanceMode"
                                checked={config.maintenanceMode}
                                onChange={handleChange}
                            />
                            <span className="toggle-slider" />
                        </label>
                    </div>

                    <div className="config-toggle-item">
                        <div>
                            <strong>Permitir Nuevos Proveedores</strong>
                            <p>Habilita el registro de nuevas empresas.</p>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                name="allowNewProviders"
                                checked={config.allowNewProviders}
                                onChange={handleChange}
                            />
                            <span className="toggle-slider" />
                        </label>
                    </div>

                    <div className="config-toggle-item">
                        <div>
                            <strong>Notificar Nuevas Propuestas</strong>
                            <p>Recibir alertas ante cada propuesta de caja.</p>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                name="notifyOnNewProposal"
                                checked={config.notifyOnNewProposal}
                                onChange={handleChange}
                            />
                            <span className="toggle-slider" />
                        </label>
                    </div>
                </div>

            </div>

            <div className="config-footer">
                <button className="btn-save-config" onClick={handleSave}>
                    Guardar Cambios
                </button>
            </div>

        </div>
    )
}

export default SystemConfiguration