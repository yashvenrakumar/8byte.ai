import { Provider } from 'react-redux'
import { store } from '@/store'
import { ThemeProvider } from '@/context/ThemeContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AppRoutes } from '@/routes'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Provider store={store}>
          <AppRoutes />
        </Provider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
