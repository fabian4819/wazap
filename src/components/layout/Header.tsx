import { Menu, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface HeaderProps {
  onMenuClick: () => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

export function Header({ onMenuClick, darkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Button
        variant="outline"
        size="icon"
        className="shrink-0 md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
      <div className="w-full flex-1">
        <h1 className="text-lg font-semibold md:text-xl">Energy Management Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          System Online
        </Badge>
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleDarkMode}
        >
          {darkMode ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}