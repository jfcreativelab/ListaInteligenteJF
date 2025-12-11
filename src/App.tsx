import { ShoppingProvider } from './context/ShoppingContext';
import { Home } from './pages/Home';
import { Toaster } from 'sonner';

function App() {
  return (
    <ShoppingProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Home />
        <Toaster richColors position="bottom-center" />
      </div>
    </ShoppingProvider>
  )
}

export default App;
