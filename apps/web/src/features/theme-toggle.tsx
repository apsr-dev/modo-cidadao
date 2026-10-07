import { Moon, Sun } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { applyTheme, storedTheme, themeStorageKey } from '../lib/theme'

export function ThemeToggle() {
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
