import { LaptopMinimal, MoonStar, SunMedium } from 'lucide-react'
import { Button } from '../ui/button'
import { useThemeMode } from '../../hooks/useThemeMode'

const themeLabel = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
}

const themeIcon = {
    light: SunMedium,
    dark: MoonStar,
    system: LaptopMinimal,
}

const ThemeToggleCycle = ({ className = '' }) => {
    const { themeMode, cycleTheme } = useThemeMode()
    const Icon = themeIcon[themeMode]

    return (
        <Button
            type="button"
            variant="outline"
            onClick={cycleTheme}
            className={className}
            aria-label={`Theme mode: ${themeLabel[themeMode]}. Click to cycle theme mode`}
        >
            <Icon className="size-4" />
            <span className="hidden sm:inline">{themeLabel[themeMode]}</span>
        </Button>
    )
}

export default ThemeToggleCycle
