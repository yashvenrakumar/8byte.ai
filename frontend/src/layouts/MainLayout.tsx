import { Outlet } from 'react-router-dom'
import logo from '@/assets/logo.svg'
import { ThemeToggle } from '@/components/ThemeToggle'

export function MainLayout() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--color-surface-muted)' }}
    >
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <img src={logo} alt="Logo" className="h-9 w-auto shrink-0" />
          <ThemeToggle />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
