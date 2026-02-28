import { Outlet } from 'react-router-dom'
import logo from '@/assets/logo.svg'

export function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <img src={logo} alt="Logo" className="h-9 w-auto" />
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Portfolio Dashboard
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
