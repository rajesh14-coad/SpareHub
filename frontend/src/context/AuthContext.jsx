import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sparehub-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isGuest, setIsGuest] = useState(() => {
    return localStorage.getItem('sparehub-guest') === 'true';
  });
  const [coords, setCoords] = useState(null);

  // Global Mock Database
  const [products, setProducts] = useState([
    { id: 1, name: 'Toyota Innova Headlight', category: 'Spare Parts', type: 'New', price: 4500, compat: 'Innova 2018+', lat: 28.6139, lng: 77.2090, stock: 5, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop' },
    { id: 2, name: 'Honda City Front Bumper', category: 'Spare Parts', type: 'Used', price: 2800, compat: 'City 2014-2016', lat: 28.6500, lng: 77.2500, stock: 1, image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop' },
    { id: 3, name: 'iPhone 13 Pro Screen', category: 'Mobile', type: 'New', price: 12000, compat: 'iPhone 13 Pro', lat: 28.4595, lng: 77.0266, stock: 8, image: 'https://images.unsplash.com/photo-1632733711679-5292d6863600?q=80&w=2070&auto=format&fit=crop' },
  ]);

  const [requests, setRequests] = useState([
    { id: 1, customerName: 'Rahul Sharma', productName: 'Mahindra Thar Front Grille', time: '14m ago', status: 'pending', amount: 4200, productId: 1 },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New Request for Toyota Headlight', time: '2m ago', type: 'request', read: false },
    { id: 2, text: 'Signal received from Mahindra Thar inquiry', time: '15m ago', type: 'signal', read: true },
    { id: 3, text: 'Price update: Innova Headlight is trending', time: '1h ago', type: 'system', read: false },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Customer', status: 'Active', joined: '2025-01-10' },
    { id: 2, name: 'AutoParts Syndicate', email: 'shop@sparehub.com', role: 'Shopkeeper', status: 'Verified', joined: '2025-01-05' },
    { id: 3, name: 'Priya Verma', email: 'priya@example.com', role: 'Customer', status: 'Active', joined: '2025-01-15' },
    { id: 4, name: 'Tech Solutions', email: 'tech@shop.com', role: 'Shopkeeper', status: 'Pending', joined: '2025-01-20' },
    { id: 5, name: 'Admin Master', email: 'admin@sparehub.com', role: 'Admin', status: 'Active', joined: '2024-12-01' },
  ]);

  const [reports, setReports] = useState([
    { id: 1, productId: 1, productName: 'Toyota Innova Headlight', reason: 'Incorrect Price', reporter: 'Alex Murphy', time: '1h ago' },
  ]);

  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem('sparehub-user', JSON.stringify(user));
    else localStorage.removeItem('sparehub-user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sparehub-guest', isGuest);
  }, [isGuest]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log('Location access denied')
      );
    }
  }, []);

  const login = (email, password, role) => {
    const foundUser = users.find(u => u.email === email);
    if (email === 'admin@sparehub.com') {
      setUser({ name: 'Admin Hub', email, role: 'Admin', avatar: null, location: 'Central Server' });
    } else {
      setUser({ name: email.split('@')[0], email, role: foundUser?.role || role, avatar: null, location: 'New Delhi, India' });
    }
    setIsGuest(false);
  };

  const signup = (name, email, password, role) => {
    const newUser = { id: Date.now(), name, email, role, status: role === 'Shopkeeper' ? 'Pending' : 'Active', joined: new Date().toISOString().split('T')[0] };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    setIsGuest(false);
  };

  const googleLogin = () => {
    // Mock Google Login
    const name = 'Alex Murphy';
    const email = 'alex.murphy@omnicorp.com';
    setUser({ name, email, role: 'Customer', avatar: 'https://i.pravatar.cc/150?u=alex', location: 'Detroit, USA' });
    setIsGuest(false);
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    setUser(null);
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('sparehub-user');
    localStorage.removeItem('sparehub-guest');
  };

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const addNotification = (text, type = 'system') => {
    setNotifications(prev => [{ id: Date.now(), text, time: 'Just now', type, read: false }, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addRequest = (request) => {
    setRequests(prev => [request, ...prev]);
    if (isShopkeeper) {
      addNotification(`New Request: ${request.productName}`, 'request');
    }
  };

  const updateRequestStatus = (id, status) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setReports(prev => prev.filter(r => r.productId !== id));
  };

  const addProduct = (product) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  // Admin Specific Actions
  const verifyShopkeeper = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'Verified' } : u));
    addNotification(`Your shop has been verified!`, 'signal');
  };

  const banUser = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'Banned' } : u));
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const broadcastNotification = (text) => {
    addNotification(`Global: ${text}`, 'signal');
    // In a real app, this would push to all users' sockets/DB
  };

  const reportProduct = (productId, reason) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    setReports(prev => [{
      id: Date.now(),
      productId,
      productName: product.name,
      reason,
      reporter: user?.name || 'Anonymous',
      time: 'Just now'
    }, ...prev]);
  };

  const isShopkeeper = user?.email === 'shop@sparehub.com' || user?.role === 'shopkeeper';
  const isAdmin = user?.email === 'admin@sparehub.com' || user?.role === 'Admin';

  // Helper to check if a product belongs to a verified shopkeeper
  const getProductVisibility = (productId) => {
    // Mock logic: for simplicity in this demo, let's assume products with id 1,2,3 are verified
    // In a real app we'd check product.ownerId and find that user's status
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user, isGuest, login, signup, logout, setIsGuest, isShopkeeper, isAdmin, coords, updateProfile, googleLogin, continueAsGuest,
      products, requests, notifications, users, isMaintenanceMode, setIsMaintenanceMode, reports,
      addRequest, updateRequestStatus, deleteProduct, addProduct, updateProduct,
      addNotification, markNotificationsAsRead, verifyShopkeeper, banUser, deleteUser, broadcastNotification, reportProduct
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
