import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import UserSelection from './pages/UserSelection';
import ShopDashboard from './pages/ShopDashboard';
import UploadPart from './pages/UploadPart';
import CustomerHome from './pages/CustomerHome';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfilePage from './pages/ProfilePage';
import ChatList from './pages/ChatList';
import ChatWindow from './pages/ChatWindow';
import ShopProfile from './pages/ShopProfile';
import AdminDashboard from './pages/AdminDashboard';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { ChatProvider } from './context/ChatContext';
import toast from 'react-hot-toast';

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) {
    setTimeout(() => toast.error("ACCESS DENIED: Administrative Clearance Required"), 0);
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppRoutes = () => {
  const { user, isGuest } = useAuth();
  const location = window.location;
  const isAuthenticated = !!user || isGuest;
  const isAdminPath = location.pathname === '/admin';

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans transition-colors duration-300">
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
            borderRadius: '1rem',
            fontWeight: 'bold',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          },
        }}
      />
      {!isAdminPath && <Navbar />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/selection" replace /> : <Login />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/selection" replace /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/selection" replace /> : <Signup />} />
        <Route path="/selection" element={!isAuthenticated ? <Navigate to="/login" replace /> : <UserSelection />} />

        {/* Shared Profile Page */}
        <Route path="/profile" element={!isAuthenticated ? <Navigate to="/login" replace /> : <ProfilePage />} />

        {/* Messaging Routes */}
        <Route path="/chats" element={!isAuthenticated ? <Navigate to="/login" replace /> : <ChatList />} />
        <Route path="/chat/:id" element={!isAuthenticated ? <Navigate to="/login" replace /> : <ChatWindow />} />

        {/* Shop & Inventory Routes */}
        <Route path="/shop/dashboard" element={!isAuthenticated ? <Navigate to="/login" replace /> : <ShopDashboard />} />
        <Route path="/shop/upload" element={!isAuthenticated ? <Navigate to="/login" replace /> : <UploadPart />} />
        <Route path="/shop/inventory" element={!isAuthenticated ? <Navigate to="/login" replace /> : <ShopDashboard />} />
        <Route path="/shop/profile/:id" element={!isAuthenticated ? <Navigate to="/login" replace /> : <ShopProfile />} />

        {/* Customer Routes */}
        <Route path="/customer/home" element={!isAuthenticated ? <Navigate to="/login" replace /> : <CustomerHome />} />
        <Route path="/customer/product/:id" element={!isAuthenticated ? <Navigate to="/login" replace /> : <ProductDetails />} />
        <Route path="/customer/requests" element={!isAuthenticated ? <Navigate to="/login" replace /> : <div className="pt-36 text-center text-text-secondary font-black italic tracking-widest text-2xl uppercase">Live Active Requests Hub</div>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SearchProvider>
          <ChatProvider>
            <Router>
              <AppRoutes />
            </Router>
          </ChatProvider>
        </SearchProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
