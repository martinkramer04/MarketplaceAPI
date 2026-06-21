import { useState } from 'react'
import './ProviderDashboard.css'
import ProviderSidebar from './components/ProviderSidebar/ProviderSidebar'
import OverviewTab from './components/OverviewTab/OverviewTab'
import MyRequestsTab from './components/MyRequestsTab/MyRequestsTab'
import BoxForm from './components/BoxForm/BoxForm'
import CompleteDetailsTab from './components/CompleteDetailsTab/CompleteDetailsTab'
import ActiveBoxesTab from './components/ActiveBoxesTab/ActiveBoxesTab'

function ProviderDashboard() {
    const [activeTab, setActiveTab] = useState('overview')
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [isEditingBox, setIsEditingBox] = useState(false)
    const [selectedBoxToEdit, setSelectedBoxToEdit] = useState(null)

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
        setIsEditingBox(true)
    }

    const renderTab = () => {
        if (isEditingBox && activeTab === 'active-boxes') {
            return (
                <BoxForm
                    mode="edit"
                    initialData={selectedBoxToEdit}
                    onCancel={() => setIsEditingBox(false)}
                    onSuccess={() => {
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
                return (
                    <BoxForm
                        mode="create"
                        onSuccess={() => handleNavigation('my-requests')}
                        onCancel={() => handleNavigation('overview')}
                    />
                )
            case 'complete-details':
                return <CompleteDetailsTab request={selectedRequest} onBack={() => handleNavigation('my-requests')} />
            case 'active-boxes':
                return <ActiveBoxesTab onEditBox={handleEditBox} />
            default:
                return <OverviewTab />
        }
    }

    return (
        <div className="provider-theme provider-dashboard">
            <ProviderSidebar activeTab={activeTab} onNavigate={handleNavigation} />
            <main className="provider-main">
                {renderTab()}
            </main>
        </div>
    )
}

export default ProviderDashboard