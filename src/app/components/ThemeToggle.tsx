import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../lib/theme-context';
import { Button } from './ui/button';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="border-slate-600 bg-slate-800/50 hover:bg-slate-700 dark:border-blue-600 dark:bg-blue-600/20 dark:hover:bg-blue-600/30 transition-all shadow-sm"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <>
          <Moon className="w-4 h-4 text-slate-300" />
          <span className="ml-2 text-slate-300">Dark</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4 text-yellow-400" />
          <span className="ml-2 text-yellow-400">Light</span>
        </>
      )}
    </Button>
  );
}
