import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import AdminPanel from './pages/AdminPanel';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-950 text-gray-500">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-950 text-gray-500">Loading...</div>;
  return isAdmin ? children : <Navigate to="/" />;
};

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-950">
        {user && <Sidebar />}
        <div className={`flex-1 flex flex-col ${user ? 'ml-72' : ''}`}>
          {user && <Navbar />}
          <main className={user ? 'p-6 lg:p-8' : ''}>
            <Routes>
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/records" element={<PrivateRoute><Records /></PrivateRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
