import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary, Dashboard } from './components'
import { CSROverviewPage, CSRDetailPage } from './pages'
import { DataProvider } from './contexts/DataContext'
import { FilterProvider } from './contexts/FilterContext'

/**
 * Rota principal do dashboard - mantida autocontida com seu próprio FilterProvider para
 * que o estado de filtro permaneça escopado apenas a esta página.
 */
function DashboardRoute() {
  return (
    <FilterProvider>
      <Dashboard />
    </FilterProvider>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<DashboardRoute />} />
            <Route path="/csr" element={<CSROverviewPage />} />
            <Route path="/csr/:csrName" element={<CSRDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </DataProvider>
    </ErrorBoundary>
  )
}

export default App
