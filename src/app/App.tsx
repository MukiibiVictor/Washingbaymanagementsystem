import { RootRouter } from './routes';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './lib/theme-context';

export default function App() {
  return (
    <ThemeProvider>
      <RootRouter />
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}
