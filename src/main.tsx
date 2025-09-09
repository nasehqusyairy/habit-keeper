import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HabitProvider } from './components/providers/habit.tsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HabitProvider>
      <App />
    </HabitProvider>
    <Toaster />
  </StrictMode>,
)
