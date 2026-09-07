import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import PublicLayout from './layouts/PublicLayout'
import LandingPage from './pages/LandingPage'
import ExperimentPage from './pages/ExperimentPage'
import BDHCQPage from './pages/BDHCQPage'
import LimitationsPage from './pages/LimitationsPage'
import SourcesPage from './pages/SourcesPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/experiment" element={<ExperimentPage />} />
              <Route path="/bdh-cq" element={<BDHCQPage />} />
              <Route path="/limitations" element={<LimitationsPage />} />
              <Route path="/sources" element={<SourcesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}

function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-5 py-24 text-center">
      <h1 className="font-serif text-3xl mb-3">Page not found</h1>
      <p className="text-ink-soft">
        That page doesn't exist. Try the experiment or head back home.
      </p>
    </div>
  )
}
