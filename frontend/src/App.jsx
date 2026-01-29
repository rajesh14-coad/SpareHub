import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import RoleSelection from './pages/RoleSelection';
import ShopkeeperSignup from './pages/ShopkeeperSignup';
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
import FavoritesPage from './pages/FavoritesPage';
import NotFound from './pages/NotFound';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { ChatProvider } from './context/ChatContext';
import { FavoritesProvider } from './context/FavoritesContext';
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
  const { user, isGuest, isShopkeeper, isAdmin } = useAuth();
  const location = useLocation();
  const isAuthenticated = !!user || isGuest;
  const isAdminPath = location.pathname.startsWith('/admin');

  // Redirection logic for authenticated users at entry roots
  const getHomePath = () => {
    if (isAdmin) return '/admin';
    if (isShopkeeper) return '/shop/dashboard';
    return '/customer/home';
  };

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
        {/* Entrance & Auth */}
        <Route path="/" element={isAuthenticated ? <Navigate to={getHomePath()} replace /> : <RoleSelection />} />
        <Route path="/role-selection" element={isAuthenticated ? <Navigate to={getHomePath()} replace /> : <RoleSelection />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to={getHomePath()} replace /> : <Login />} />
        <Route path="/admin-login" element={isAuthenticated ? <Navigate to={getHomePath()} replace /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to={getHomePath()} replace /> : <Signup />} />
        <Route path="/shopkeeper-signup" element={isAuthenticated ? <Navigate to={getHomePath()} replace /> : <ShopkeeperSignup />} />

        {/* Dashboards */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        {/* Shared Profile Page */}
        <Route path="/profile" element={!isAuthenticated ? <Navigate to="/" replace /> : <ProfilePage />} />

        {/* Messaging Routes */}
        <Route path="/chats" element={!isAuthenticated ? <Navigate to="/" replace /> : <ChatList />} />
        <Route path="/chat/:id" element={!isAuthenticated ? <Navigate to="/" replace /> : <ChatWindow />} />

        {/* Shop & Inventory Routes */}
        <Route path="/shop/dashboard" element={!isAuthenticated ? <Navigate to="/" replace /> : <ShopDashboard />} />
        <Route path="/shop/upload" element={!isAuthenticated ? <Navigate to="/" replace /> : <UploadPart />} />
        <Route path="/shop/inventory" element={!isAuthenticated ? <Navigate to="/" replace /> : <ShopDashboard />} />
        <Route path="/shop/profile/:id" element={!isAuthenticated ? <Navigate to="/" replace /> : <ShopProfile />} />

        {/* Customer Routes */}
        <Route path="/customer/home" element={!isAuthenticated ? <Navigate to="/" replace /> : <CustomerHome />} />
        <Route path="/customer/favorites" element={!isAuthenticated ? <Navigate to="/" replace /> : <FavoritesPage />} />
        <Route path="/customer/product/:id" element={!isAuthenticated ? <Navigate to="/" replace /> : <ProductDetails />} />
        <Route path="/customer/requests" element={!isAuthenticated ? <Navigate to="/" replace /> : <div className="pt-36 text-center text-text-secondary font-black italic tracking-widest text-2xl uppercase">Live Active Requests Hub</div>} />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <SearchProvider>
            <ChatProvider>
              <Router>
                <AppRoutes />
              </Router>
            </ChatProvider>
          </SearchProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
