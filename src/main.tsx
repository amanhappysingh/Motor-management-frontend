import { createRoot } from 'react-dom/client'
import './index.css' 
import { router } from './router'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ToastContainer position='top-right' autoClose={2000} />
  </QueryClientProvider>
)
