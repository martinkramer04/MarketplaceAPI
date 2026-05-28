import './ActiveBoxesTab.css'

const mockActiveBoxes = [
    {
        id: 1,
        name: 'Luxury Wellness Retreat',
        sku: 'SKU: WB-7721',
        categories: ['SPA', 'LUXURY'],
        activations: 342,
        status: 'published'
    },
    {
        id: 2,
        name: 'The Michelin Experience',
        sku: 'SKU: GD-1190',
        categories: ['DINING'],
        activations: 812,
        status: 'published'
    },
    {
        id: 3,
        name: 'Alpine Getaway Escape',
        sku: 'SKU: EX-4423',
        categories: ['TRAVEL'],
        activations: 0,
        status: 'draft'
    },
]

function ActiveBoxesTab() {
    return (
        <div className="active-boxes">
            <div className="tab-header">
                <h1>Cajas Activas / Publicadas</h1>
                <p>Métricas de tus experiencias actualmente en vivo en BigBox.</p>
            </div>

            <div className="ab-table-wrapper">
                <div className="ab-table-toolbar">
                    <input type="text" placeholder="🔍 Buscar cajas..." className="ab-search" />
                </div>

                <table className="ab-table">
                    <thead>
                        <tr>
                            <th>Experiencia</th>
                            <th>Categorías</th>
                            <th>Activaciones</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockActiveBoxes.map((box) => (
                            <tr key={box.id}>
                                <td>
                                    <div className="ab-box-info">
                                        <div className="ab-box-thumb" />
                                        <div>
                                            <strong>{box.name}</strong>
                                            <p>{box.sku}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="ab-categories">
                                        {box.categories.map((cat) => (
                                            <span key={cat} className="ab-cat-tag">{cat}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="ab-activations">{box.activations.toLocaleString()}</td>
                                <td>
                                    <span className={`status-badge ${box.status === 'published' ? 'status-approved' : 'status-pending'}`}>
                                        {box.status === 'published' ? '● Publicado' : '● Borrador'}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-edit-box">Editar →</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="ab-table-footer">
                    Mostrando {mockActiveBoxes.length} cajas
                </div>
            </div>
        </div>
    )
}

export default ActiveBoxesTab