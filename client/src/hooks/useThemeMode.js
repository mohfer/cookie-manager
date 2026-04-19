import { useContext } from 'react'
import { ThemeContext } from '../components/theme/theme-context'

export const useThemeMode = () => {
    const context = useContext(ThemeContext)

    if (!context) {
        throw new Error('useThemeMode must be used inside ThemeProvider')
    }

    return context
}
