import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
          <div className="text-center max-w-md w-full">
            <h1 className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-4 wrap-break-word">
              {this.state.error.message}
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-5 py-2.5 sm:py-2 text-sm font-medium bg-gray-800 text-white rounded-none hover:bg-gray-700 min-h-[44px] sm:min-h-0 touch-manipulation"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
