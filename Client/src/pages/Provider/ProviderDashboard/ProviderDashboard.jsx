import { useState, useEffect } from 'react'
import './ProviderDashboard.css'
import ProviderSidebar from './components/ProviderSidebar/ProviderSidebar'
import OverviewTab from './components/OverviewTab/OverviewTab'
import MyRequestsTab from './components/MyRequestsTab/MyRequestsTab'
import ProposeBoxForm from './components/ProposeBoxForm/ProposeBoxForm'
import CompleteDetailsTab from './components/CompleteDetailsTab/CompleteDetailsTab'
import ActiveBoxesTab from './components/ActiveBoxesTab/ActiveBoxesTab'
import EditBoxForm from './components/EditBoxForm/EditBoxForm'
import NavbarProvider from '../../../components/Navbar/NavbarProvider'

function ProviderDashboard() {
    const [activeTab, setActiveTab] = useState('overview')
    const [selectedRequest, setSelectedRequest] = useState(null)
    
    // Usamos este estado específico para controlar cuándo se dibuja el formulario
    const [isEditingBox, setIsEditingBox] = useState(false)
    const [selectedBoxToEdit, setSelectedBoxToEdit] = useState(null)
    
    useEffect(() => {
        const userNavbar = document.querySelector('nav.navbar');
        if (userNavbar) {
            userNavbar.style.display = 'none';
        }
        return () => {
            if (userNavbar) {
                userNavbar.style.display = ''; 
            }
        };
    }, []);

    // Si el usuario cambia de pestaña en el Sidebar, cerramos cualquier edición abierta automáticamente
    const handleNavigation = (tabId) => {
        setIsEditingBox(false)
        setSelectedRequest(null)
        setActiveTab(tabId)
    }

    const handleCompleteDetails = (request) => {
        setSelectedRequest(request)
        setActiveTab('complete-details')
    }

    const handleEditBox = (box) => {
        setSelectedBoxToEdit(box)
        setIsEditingBox(true) // Activamos la vista de edición de forma independiente
    }

    const renderTab = () => {
        // Si el estado de edición está activo y estamos parados en la solapa de cajas, mostramos el formulario
        if (isEditingBox && activeTab === 'active-boxes') {
            return (
                <EditBoxForm 
                    propuestaInicial={selectedBoxToEdit} 
                    onCancel={() => setIsEditingBox(false)} 
                    onUpdatePropuesta={() => {
                        setIsEditingBox(false)
                        setActiveTab('my-requests')
                    }}
                />
            )
        }

        switch (activeTab) {
            case 'overview':
                return <OverviewTab onNavigate={handleNavigation} />
            case 'my-requests':
                return <MyRequestsTab onCompleteDetails={handleCompleteDetails} />
            case 'propose-box':
                return <ProposeBoxForm onSuccess={() => handleNavigation('my-requests')} />
            case 'complete-details':
                return <CompleteDetailsTab request={selectedRequest} onBack={() => handleNavigation('my-requests')} />
            case 'active-boxes':
                return <ActiveBoxesTab onEditBox={handleEditBox} />
            default:
                return <OverviewTab />
        }
    }

    return (
        <>
            <NavbarProvider />
            <div className="provider-theme provider-dashboard">
                <ProviderSidebar activeTab={activeTab} onNavigate={handleNavigation} />
                <main className="provider-main">
                    {renderTab()}
                </main>
            </div>
        </>
    )
}

export default ProviderDashboard