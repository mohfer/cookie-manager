import { useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './theme-context'

const THEME_KEY = 'themeMode'
const CYCLE = ['light', 'dark', 'system']

const getSystemPrefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches

const applyThemeClass = (mode) => {
    const root = document.documentElement
    const prefersDark = getSystemPrefersDark()
    const shouldUseDark = mode === 'dark' || (mode === 'system' && prefersDark)

    root.classList.toggle('dark', shouldUseDark)
    root.setAttribute('data-theme', mode)
}

const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState(() => {
        const saved = localStorage.getItem(THEME_KEY)
        return CYCLE.includes(saved) ? saved : 'system'
    })

    useEffect(() => {
        applyThemeClass(themeMode)
        localStorage.setItem(THEME_KEY, themeMode)
    }, [themeMode])

    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)')
        const onChange = () => {
            if (themeMode === 'system') {
                applyThemeClass('system')
            }
        }

        media.addEventListener('change', onChange)
        return () => media.removeEventListener('change', onChange)
    }, [themeMode])

    const cycleTheme = useCallback(() => {
        setThemeMode((current) => {
            const index = CYCLE.indexOf(current)
            return CYCLE[(index + 1) % CYCLE.length]
        })
    }, [])

    const value = useMemo(() => ({ themeMode, setThemeMode, cycleTheme }), [themeMode, cycleTheme])

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export { ThemeProvider }
