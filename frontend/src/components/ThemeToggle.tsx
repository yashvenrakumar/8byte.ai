import { useTheme } from '@/context/ThemeContext'
import type { ThemeMode } from '@/context/ThemeContext'

const options: { value: ThemeMode; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-border bg-surface p-0.5 shadow-sm">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setTheme(opt.value)}
          title={`${opt.label} theme`}
          className={`flex items-center justify-center gap-1.5 rounded-md px-2.5 py-2 sm:py-1.5 min-h-[44px] sm:min-h-0 text-sm font-medium transition-colors touch-manipulation ${
            theme === opt.value
              ? 'bg-accent text-white shadow-sm'
              : 'text-text-muted hover:bg-surface-muted hover:text-text'
          }`}
        >
          <span className="text-base leading-none" aria-hidden>
            {opt.icon}
          </span>
          <span className="hidden sm:inline">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}
