import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ToastContainer } from 'react-toastify'
import { TransactionProvider } from './contexts/TransactionContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TransactionProvider>
          <App />
        </TransactionProvider>
        <ToastContainer position='bottom-right' theme='light' />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
