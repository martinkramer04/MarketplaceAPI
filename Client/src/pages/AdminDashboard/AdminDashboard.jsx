import { useState } from 'react'
import './AdminDashboard.css'
import NavbarProvider from '../../components/Navbar/NavbarProvider'
import AdminSidebar from './components/AdminSidebar/AdminSidebar';
import VistaGeneral from './components/GeneralView/GeneralView';
import PropuestasCajas from './components/BoxesSolicitations/BoxesSolicitations';
import Proveedores from './components/Providers/Providers';
import ConfiguracionSistema from './components/SystemConfiguration/SystemConfiguration';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('vistaGeneral')

    const renderTab = () => {
        switch (activeTab) {
            case 'vistaGeneral': return <VistaGeneral />
            case 'propuestasCajas': return <PropuestasCajas />
            case 'proveedores': return <Proveedores />
            case 'configuracionSistema': return <ConfiguracionSistema />
            default: return <VistaGeneral />
        }
    }

    return (
        <div className="admin-theme admin-dashboard-wrapper">
            <NavbarProvider isAdmin={true} />
            <div className="admin-dashboard">
                <AdminSidebar activeTab={activeTab} onNavigate={setActiveTab} />
                <main className="admin-main">
                    {renderTab()}
                </main>
            </div>
        </div>
    )
}

export default AdminDashboard