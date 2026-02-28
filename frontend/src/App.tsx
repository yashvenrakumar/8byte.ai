import { Provider } from 'react-redux'
import { store } from '@/store'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AppRoutes } from '@/routes'

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </ErrorBoundary>
  )
}

export default App
