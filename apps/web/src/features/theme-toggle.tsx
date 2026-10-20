import { Moon, Sun } from 'lucide-react'
import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { applyTheme, storedTheme, themeStorageKey } from '../lib/theme'

const ThemeContext = createContext<{ dark: boolean; toggle: () => void } | null>(null)

// The root provider survives transitions between the marketing and application layouts.
// Its state is request-local during SSR and stays in this browser tab after hydration.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false)
  const manualTheme = useRef<string | null>(null)

  useEffect(() => {
    const system = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => {
      const stored = storedTheme()
      manualTheme.current = stored === 'dark' || stored === 'light' ? stored : null
      const next = stored === 'dark' || (stored !== 'light' && system.matches)
      applyTheme(next)
      setDark(next)
    }
    const onSystemChange = () => {
      if (manualTheme.current === null) sync()
    }
    const onStorageChange = (event: StorageEvent) => {
      if (event.key === themeStorageKey || event.key === null) sync()
    }
    sync()
    system.addEventListener('change', onSystemChange)
    window.addEventListener('storage', onStorageChange)
    return () => {
      system.removeEventListener('change', onSystemChange)
      window.removeEventListener('storage', onStorageChange)
    }
  }, [])

  function toggle() {
    const next = !dark
    manualTheme.current = next ? 'dark' : 'light'
    applyTheme(next)
    setDark(next)
    try {
      localStorage.setItem(themeStorageKey, manualTheme.current)
    } catch {
      // The toggle still works when browser storage is unavailable.
    }
  }

  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>
}

export function ThemeToggle() {
  const theme = useContext(ThemeContext)
  if (!theme) throw new Error('ThemeToggle requires ThemeProvider')
  const { dark, toggle } = theme
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Tema escuro"
      aria-pressed={dark}
      title={dark ? 'Usar tema claro' : 'Usar tema escuro'}
      onClick={toggle}
    >
      {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  )
}
