import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/Routes.jsx'
import { ModalProvider } from './context/ModalContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { FavoritesProvider } from './contexts/FavoritesContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <FavoritesProvider>
        <ModalProvider>
          <RouterProvider router={router} />
        </ModalProvider>
      </FavoritesProvider>
    </AuthProvider>
  </StrictMode>,
)
