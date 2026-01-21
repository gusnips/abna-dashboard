import { ErrorBoundary, Dashboard } from './components'
import { DataProvider } from './contexts/DataContext'
import { FilterProvider } from './contexts/FilterContext'

function App() {
  return (
    <ErrorBoundary>
      <DataProvider>
        <FilterProvider>
          <Dashboard />
        </FilterProvider>
      </DataProvider>
    </ErrorBoundary>
  )
}

export default App
