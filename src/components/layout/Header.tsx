import { Menu, Moon, Sun, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStreaming } from '@/contexts/StreamingContext'

interface HeaderProps {
  onMenuClick: () => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

export function Header({ onMenuClick, darkMode, onToggleDarkMode }: HeaderProps) {
  const { isStreaming } = useStreaming()

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
      <div className="flex items-center gap-2">
        {isStreaming && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
            <Activity className="w-3 h-3 mr-1 animate-pulse" />
            Streaming
          </Badge>
        )}
        <Badge variant="outline" className="hidden sm:flex bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
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