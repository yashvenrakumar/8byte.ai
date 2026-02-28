import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">404</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">Page not found.</p>
      <Link
        to="/"
        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
      >
        Go to Dashboard
      </Link>
    </div>
  )
}
