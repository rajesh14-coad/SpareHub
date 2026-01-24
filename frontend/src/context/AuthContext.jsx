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

  const [completedOrders, setCompletedOrders] = useState([]);
  const [ratings, setRatings] = useState([]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New Request for Toyota Headlight', time: '2m ago', type: 'request', read: false },
    { id: 2, text: 'Signal received from Mahindra Thar inquiry', time: '15m ago', type: 'signal', read: true },
    { id: 3, text: 'Price update: Innova Headlight is trending', time: '1h ago', type: 'system', read: false },
  ]);

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('sparehub-all-users');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Customer', status: 'Active', joined: '2025-01-10' },
      { id: 2, name: 'AutoParts Syndicate', email: 'shop@sparehub.com', role: 'shopkeeper', status: 'Verified', isVerified: true, joined: '2025-01-05' },
      { id: 3, name: 'Priya Verma', email: 'priya@example.com', role: 'Customer', status: 'Active', joined: '2025-01-15' },
      { id: 4, name: 'Tech Solutions', email: 'tech@shop.com', role: 'shopkeeper', status: 'Pending', isVerified: false, joined: '2025-01-20' },
      { id: 5, name: 'Admin Master', email: 'admin@sparehub.com', role: 'Admin', status: 'Active', joined: '2024-12-01' },
    ];
  });

  const [pendingShopkeepers, setPendingShopkeepers] = useState(() => {
    const saved = localStorage.getItem('sparehub-pending-shopkeepers');
    return saved ? JSON.parse(saved) : [];
  });

  const [reports, setReports] = useState([
    { id: 1, productId: 1, productName: 'Toyota Innova Headlight', reason: 'Incorrect Price', reporter: 'Alex Murphy', time: '1h ago' },
  ]);

  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(() => {
    const saved = localStorage.getItem('sparehub-registration-open');
    return saved ? saved === 'true' : true;
  });

  // Persistence for users and requests
  useEffect(() => {
    localStorage.setItem('sparehub-all-users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('sparehub-pending-shopkeepers', JSON.stringify(pendingShopkeepers));
  }, [pendingShopkeepers]);

  // Generate 4-digit booking code
  const generateBookingCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  useEffect(() => {
    if (user) localStorage.setItem('sparehub-user', JSON.stringify(user));
    else localStorage.removeItem('sparehub-user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sparehub-guest', isGuest);
  }, [isGuest]);

  useEffect(() => {
    localStorage.setItem('sparehub-registration-open', isRegistrationOpen);
  }, [isRegistrationOpen]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log('Location access denied')
      );
    }
  }, []);

  const login = (email, password, role) => {
    // Prioritize finding a VERIFIED user if duplicates exist (fixes shadowing bug)
    const foundUser = users.find(u => u.email === email && u.isVerified) || users.find(u => u.email === email);

    // Admin override for demo
    if (email === 'admin@sparehub.com') {
      setUser({ name: 'Admin Hub', email, role: 'Admin', avatar: null, location: 'Central Server' });
      setIsGuest(false);
      return { success: true };
    }

    if (!foundUser) {
      return { success: false, message: 'User not found' };
    }

    if (foundUser.status === 'Banned' || foundUser.isBanned) {
      return { success: false, message: 'Account Banned. Contact Admin.' };
    }

    if (foundUser.role?.toLowerCase() === 'shopkeeper' && !foundUser.isVerified) {
      return { success: false, message: 'Verification Pending. Our admin is reviewing your shop.' };
    }

    setUser(foundUser);
    setIsGuest(false);
    return { success: true };
  };

  const signup = (name, email, password, role) => {
    if (!isRegistrationOpen) {
      return { success: false, message: 'Registrations are currently closed.' };
    }

    if (users.some(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      role: role.toLowerCase(),
      status: role.toLowerCase() === 'shopkeeper' ? 'Pending' : 'Active',
      isVerified: false,
      joined: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [...prev, newUser]);

    if (newUser.status === 'Pending') {
      toast.success("Registration Sent! Admin will verify soon.");
      return { success: true, pending: true };
    }

    setUser(newUser);
    setIsGuest(false);
    return { success: true };
  };

  const googleLogin = (mockGoogleUser) => {
    // Simulate getting data from Google Provider
    const googleProfile = mockGoogleUser || {
      name: 'Alex Murphy',
      email: 'alex.murphy@omnicorp.com',
      avatar: 'https://i.pravatar.cc/150?u=alex',
      token: 'mock-google-token-123'
    };

    const existingUser = users.find(u => u.email === googleProfile.email);

    if (existingUser) {
      if (existingUser.status === 'Banned' || existingUser.isBanned) {
        return { success: false, message: 'Account Banned. Contact Admin.' };
      }
      setUser(existingUser);
      setIsGuest(false);
      toast.success(`Welcome back, ${existingUser.name}!`);
      return { success: true };
    } else {
      // Auto-create account for new Google Users
      if (!isRegistrationOpen) {
        return { success: false, message: 'Registrations are currently closed.' };
      }

      const newUser = {
        id: Date.now(),
        name: googleProfile.name,
        email: googleProfile.email,
        role: 'customer', // Google Login defaults to Customer
        status: 'Active',
        isVerified: true, // Google accounts are implicitly verified for identity
        joined: new Date().toISOString().split('T')[0],
        avatar: googleProfile.avatar
      };

      setUsers(prev => [...prev, newUser]);
      setUser(newUser);
      setIsGuest(false);
      toast.success(`Account created! Welcome, ${newUser.name}.`);
      return { success: true };
    }
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
    if (status === 'accepted') {
      const bookingCode = generateBookingCode();
      setRequests(prev => prev.map(req =>
        req.id === id ? { ...req, status, bookingCode, acceptedAt: new Date().toISOString() } : req
      ));
      addNotification(`Order accepted! Booking code: ${bookingCode}`, 'success');
    } else {
      setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
    }
  };

  const verifyBookingCode = (requestId, code) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return false;
    return request.bookingCode === code;
  };

  const completeOrder = (requestId, verificationCode) => {
    const request = requests.find(r => r.id === requestId);
    if (!request || !verifyBookingCode(requestId, verificationCode)) {
      return { success: false, message: 'Invalid booking code' };
    }

    const completedOrder = {
      ...request,
      status: 'completed',
      completedAt: new Date().toISOString(),
      invoiceNumber: `INV-${Date.now()}`,
      shopName: 'AutoParts Syndicate',
    };

    setCompletedOrders(prev => [completedOrder, ...prev]);
    setRequests(prev => prev.filter(r => r.id !== requestId));
    addNotification(`Order #${completedOrder.invoiceNumber} completed!`, 'success');

    return { success: true, order: completedOrder };
  };

  const addRating = (orderId, rating, review) => {
    const newRating = {
      id: Date.now(),
      orderId,
      rating,
      review,
      customerName: user?.name,
      createdAt: new Date().toISOString(),
    };
    setRatings(prev => [newRating, ...prev]);
    addNotification('Thank you for your feedback!', 'success');
  };

  const getOrderHistory = (userType) => {
    if (userType === 'customer') {
      return completedOrders.filter(order => order.customerName === user?.name);
    } else if (userType === 'shopkeeper') {
      return completedOrders;
    }
    return [];
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
  const submitShopkeeperRequest = (data) => {
    const newRequest = {
      id: Date.now(),
      ...data,
      status: 'Pending',
      isVerified: false,
      role: 'shopkeeper',
      submittedAt: new Date().toISOString()
    };
    setPendingShopkeepers(prev => [...prev, newRequest]);

    const newUser = {
      id: newRequest.id,
      name: data.name,
      email: data.email,
      role: 'shopkeeper',
      status: 'Pending',
      isVerified: false,
      joined: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
  };

  const sendEmailNotification = (email, subject, body) => {
    console.log(`[EMAIL SENT] To: ${email} | Subject: ${subject} | Body: ${body}`);
    // Placeholder for SMTP integration
  };

  const approveShopkeeper = (id) => {
    const request = pendingShopkeepers.find(r => r.id === id);
    if (request) {
      setUsers(prev => prev.map(u => {
        if (u.email === request.email) {
          return {
            ...u,
            status: 'Verified',
            isVerified: true,
            role: 'shopkeeper',
            shopDetails: {
              name: request.shopName,
              type: request.shopType,
              products: request.productsDealtIn,
              hours: `${request.openingTime} - ${request.closingTime}`,
              days: request.workingDays.join(', '),
              address: `${request.address}, ${request.city}, ${request.state} - ${request.pincode}`
            }
          };
        }
        return u;
      }));
      setPendingShopkeepers(prev => prev.filter(r => r.id !== id));

      const notifMessage = `Congratulations! Your shop ${request.shopName} has been verified.`;
      addNotification(notifMessage, 'success');
      sendEmailNotification(request.email, "Verification Approved", notifMessage);
    }
  };

  const rejectShopkeeper = (id) => {
    setPendingShopkeepers(prev => prev.filter(r => r.id !== id));
    addNotification(`Shopkeeper request rejected.`, 'system');
  };

  const verifyShopkeeper = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const newStatus = u.isVerified ? 'Active' : 'Verified';
        const newVerified = !u.isVerified;
        if (newVerified) sendEmailNotification(u.email, "Shop Verified", "Your shop status has been updated to Verified.");
        return { ...u, status: newStatus, isVerified: newVerified };
      }
      return u;
    }));
  };

  const banUser = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'Banned', isBanned: true } : u));
  };

  const unbanUser = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'Active', isBanned: false } : u));
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const toggleRegistration = () => {
    setIsRegistrationOpen(prev => !prev);
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
      products, requests, notifications, users, isMaintenanceMode, setIsMaintenanceMode, reports, completedOrders, ratings, pendingShopkeepers,
      addRequest, updateRequestStatus, deleteProduct, addProduct, updateProduct,
      addNotification, markNotificationsAsRead, verifyShopkeeper, banUser, unbanUser, deleteUser, broadcastNotification, reportProduct,
      verifyBookingCode, completeOrder, addRating, getOrderHistory, submitShopkeeperRequest, approveShopkeeper, rejectShopkeeper,
      isRegistrationOpen, toggleRegistration
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
