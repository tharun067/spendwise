import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import HowItWorks from './pages/HowItWorks';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';


function App() {
  const { currentUser, loading } = useAuth();

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>
    if (!currentUser) return <Navigate to="/login" />
    return children;
  }
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/how-it-works' element={<HowItWorks />} />
      <Route path='/' element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
      </Route>
      <Route path='*' element={<NotFound/> } />
    </Routes>
  )
}

export default App
