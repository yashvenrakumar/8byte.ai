import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 sm:px-6">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">404</h1>
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-2">Page not found.</p>
      <Link
        to="/"
        className="mt-6 px-5 py-2.5 sm:py-2 text-sm font-medium bg-gray-800 text-white rounded-none hover:bg-gray-700 min-h-[44px] inline-flex items-center justify-center touch-manipulation"
      >
        Go to Dashboard
      </Link>
    </div>
  )
}
