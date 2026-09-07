import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ExperimentProvider } from './context/ExperimentContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import PublicLayout from './layouts/PublicLayout'

// Code-split: each page loads its own chunk so the initial bundle is smaller.
const Landing    = lazy(() => import('./pages/Landing'))
const Experiment = lazy(() => import('./pages/Experiment'))
const BDHCQ      = lazy(() => import('./pages/BDHCQ'))
const Limitation = lazy(() => import('./pages/Limitation'))
const Sources    = lazy(() => import('./pages/Sources'))
const Dashboard  = lazy(() => import('./pages/Dashboard'))

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[40vh] text-ink-faint text-sm">
      Loading…
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ExperimentProvider>
          <BrowserRouter>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route path="/"           element={<Landing />} />
                  <Route path="/experiment" element={<Experiment />} />
                  <Route path="/bdh-cq"     element={<BDHCQ />} />
                  <Route path="/limitation" element={<Limitation />} />
                  <Route path="/sources"    element={<Sources />} />
                  <Route path="/dashboard"  element={<Dashboard />} />
                  <Route path="*"           element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ExperimentProvider>
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
