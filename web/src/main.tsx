import { createRoot } from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';
import { App } from './app';
import './index.css';

const root = createRoot(document.getElementById('root')!);
const qc = new QueryClient();

root.render(
  <QueryClientProvider client={qc}>
    <App />
    <Toaster />
  </QueryClientProvider>,
);
