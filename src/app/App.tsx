import { RootRouter } from './routes';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <>
      <RootRouter />
      <Toaster position="top-right" />
    </>
  );
}
