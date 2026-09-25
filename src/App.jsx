import { Routes, Route } from 'react-router-dom'
import SignIn from './pages/SignIn.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Organisations from './pages/Organisations.jsx'
import OrganisationDetail from './pages/OrganisationDetail.jsx'
import Contacts from './pages/Contacts.jsx'
import Engagements from './pages/Engagements.jsx'
import Opportunities from './pages/Opportunities.jsx'
import Commitments from './pages/Commitments.jsx'
import Tasks from './pages/Tasks.jsx'
import Reports from './pages/Reports.jsx'
import Settings from './pages/Settings.jsx'
import Notifications from './pages/Notifications.jsx'
import AddOrganisation from './pages/AddOrganisation.jsx'
import Users from './pages/Users.jsx'

// Wrap every page except /signin - one line per route keeps this readable
// as more pages get added.
export default function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/organisations" element={<ProtectedRoute><Organisations /></ProtectedRoute>} />
      <Route path="/organisations/new" element={<ProtectedRoute><AddOrganisation /></ProtectedRoute>} />
      <Route path="/organisations/:id" element={<ProtectedRoute><OrganisationDetail /></ProtectedRoute>} />
      <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
      <Route path="/engagements" element={<ProtectedRoute><Engagements /></ProtectedRoute>} />
      <Route path="/opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
      <Route path="/commitments" element={<ProtectedRoute><Commitments /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
    </Routes>
  )
}
