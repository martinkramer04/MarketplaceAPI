import { useState } from 'react'
import './AdminDashboard.css'

import AdminSidebar from './components/AdminSidebar/AdminSidebar';
import VistaGeneral from './components/GeneralView/GeneralView';
import PropuestasCajas from './components/BoxesSolicitations/BoxesSolicitations';
import Proveedores from './components/Providers/Providers';
import ConfiguracionSistema from './components/SystemConfiguration/SystemConfiguration';
import AdminBoxes from './components/AdminBoxes/AdminBoxes';
import AdminCoupons from './components/AdminCoupons/AdminCoupons';
import AdminOrders from './components/AdminOrders/AdminOrders';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('vistaGeneral')

    const renderTab = () => {
        switch (activeTab) {
            case 'vistaGeneral': return <VistaGeneral />
            case 'propuestasCajas': return <PropuestasCajas />
            case 'proveedores': return <Proveedores />
            case 'boxes': return <AdminBoxes />;
            case 'cupones': return <AdminCoupons />;
            case 'ordenes': return <AdminOrders />;
            case 'configuracionSistema': return <ConfiguracionSistema />
            default: return <VistaGeneral />
        }
    }

    return (

        <div className="admin-theme admin-dashboard">
            <AdminSidebar activeTab={activeTab} onNavigate={setActiveTab} />
            <main className="admin-main">
                {renderTab()}
            </main>
        </div>
    )
}

export default AdminDashboard