import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ToastContainer } from 'react-toastify'
import { TransactionProvider } from './contexts/TransactionContext.jsx'
import { MonthlySavingsProvider } from './contexts/MonthlySavingsContext.jsx';
import 'react-toastify/dist/ReactToastify.css'
import 'react-datepicker/dist/react-datepicker.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TransactionProvider>
          <MonthlySavingsProvider>
            <App />
            <ToastContainer position='bottom-right' theme='light' />
          </MonthlySavingsProvider>
        </TransactionProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
