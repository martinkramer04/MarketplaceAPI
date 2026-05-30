import { useState, useEffect } from 'react'
import './ProviderDashboard.css'
import ProviderSidebar from './components/ProviderSidebar/ProviderSidebar'
import OverviewTab from './components/OverviewTab/OverviewTab'
import MyRequestsTab from './components/MyRequestsTab/MyRequestsTab'
import ProposeBoxTab from './components/ProposeBoxTab/ProposeBoxTab'
import ActiveBoxesTab from './components/ActiveBoxesTab/ActiveBoxesTab'
import CompleteDetailsTab from './components/CompleteDetailsTab/CompleteDetailsTab'
import NavbarProvider from '../../../components/Navbar/NavbarProvider'

function ProviderDashboard() {
    const [activeTab, setActiveTab] = useState('overview')
    const [selectedRequest, setSelectedRequest] = useState(null)
    
  
    // El useEffect es para poder mostrar la navbar preventiva que hicimos para proveedores, sacarlo cuando conectemos el back
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

    const handleCompleteDetails = (request) => {
        setSelectedRequest(request)
        setActiveTab('complete-details')
    }

    const renderTab = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab onNavigate={setActiveTab} />
            case 'my-requests':
                return <MyRequestsTab onCompleteDetails={handleCompleteDetails} />
            case 'propose-box':
                return <ProposeBoxTab onSuccess={() => setActiveTab('my-requests')} />
            case 'complete-details':
                return <CompleteDetailsTab request={selectedRequest} onBack={() => setActiveTab('my-requests')} />
            case 'active-boxes':
                return <ActiveBoxesTab />
            default:
                return <OverviewTab />
        }
    }

    return (
        <>
        <NavbarProvider />

        <div className="provider-theme provider-dashboard">
            <ProviderSidebar activeTab={activeTab} onNavigate={setActiveTab} />
            <main className="provider-main">
                {renderTab()}
            </main>
        </div>
        </>
    )
}

export default ProviderDashboard