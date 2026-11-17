import { lazy, Suspense } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import AppLayout from './components/layout/AppLayout.jsx'
import LoadingState from './components/LoadingState.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

const DashboardOverview = lazy(() => import('./pages/DashboardOverview.jsx'))
const ClinicalTrials = lazy(() => import('./pages/ClinicalTrials.jsx'))
const Participants = lazy(() => import('./pages/Participants.jsx'))
const Visits = lazy(() => import('./pages/Visits.jsx'))
const ECRF = lazy(() => import('./pages/ECRF.jsx'))
const AyurvedaAssessment = lazy(() => import('./pages/AyurvedaAssessment.jsx'))
const AdverseEvents = lazy(() => import('./pages/AdverseEvents.jsx'))
const RegulatoryCompliance = lazy(() => import('./pages/RegulatoryCompliance.jsx'))
const ReportsAnalytics = lazy(() => import('./pages/ReportsAnalytics.jsx'))
const AuditTrail = lazy(() => import('./pages/AuditTrail.jsx'))
const Notifications = lazy(() => import('./pages/Notifications.jsx'))
const UserManagement = lazy(() => import('./pages/UserManagement.jsx'))

function NotFoundPage() {
  return (
    <main className="not-found">
      <h1>Page not found</h1>
      <p>The page you’re looking for doesn’t exist.</p>
      <Link to="/">Return home</Link>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Suspense fallback={<LoadingState label="Loading overview" />}><DashboardOverview /></Suspense>} />
          <Route path="clinical-trials" element={<Suspense fallback={<LoadingState label="Loading clinical trials" />}><ClinicalTrials /></Suspense>} />
          <Route path="participants" element={<Suspense fallback={<LoadingState label="Loading participants" />}><Participants /></Suspense>} />
          <Route path="visits" element={<Suspense fallback={<LoadingState label="Loading visit management" />}><Visits /></Suspense>} />
          <Route path="data-collection" element={<Suspense fallback={<LoadingState label="Loading eCRF data collection" />}><ECRF /></Suspense>} />
          <Route path="ayurveda-assessment" element={<Suspense fallback={<LoadingState label="Loading Ayurveda assessment" />}><AyurvedaAssessment /></Suspense>} />
          <Route path="adverse-events" element={<Suspense fallback={<LoadingState label="Loading Adverse Events" />}><AdverseEvents /></Suspense>} />
          <Route path="regulatory-compliance" element={<Suspense fallback={<LoadingState label="Loading Regulatory Compliance" />}><RegulatoryCompliance /></Suspense>} />
          <Route path="reports-analytics" element={<Suspense fallback={<LoadingState label="Loading Reports & Analytics" />}><ReportsAnalytics /></Suspense>} />
          <Route path="audit-trail" element={<Suspense fallback={<LoadingState label="Loading Audit Trail" />}><AuditTrail /></Suspense>} />
          <Route path="notifications" element={<Suspense fallback={<LoadingState label="Loading Notifications" />}><Notifications /></Suspense>} />
          <Route path="user-management" element={<Suspense fallback={<LoadingState label="Loading User Management" />}><UserManagement /></Suspense>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
