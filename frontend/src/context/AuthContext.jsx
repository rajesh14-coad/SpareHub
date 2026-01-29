import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('purzasetu-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isGuest, setIsGuest] = useState(() => {
    return localStorage.getItem('purzasetu-guest') === 'true';
  });
  const [coords, setCoords] = useState(null);

  // Global Database - Production Ready
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('purzasetu-products');
    return saved ? JSON.parse(saved) : [];
  });

  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('purzasetu-requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedOrders, setCompletedOrders] = useState(() => {
    const saved = localStorage.getItem('purzasetu-completed-orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem('purzasetu-ratings');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('purzasetu-notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('purzasetu-all-users');
    return saved ? JSON.parse(saved) : [];
  });

  const [pendingShopkeepers, setPendingShopkeepers] = useState(() => {
    const saved = localStorage.getItem('purzasetu-pending-shopkeepers');
    return saved ? JSON.parse(saved) : [];
  });

  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('purzasetu-reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(() => {
    const saved = localStorage.getItem('purzasetu-registration-open');
    return saved ? saved === 'true' : true;
  });

  // Persistence for database consistency
  useEffect(() => {
    localStorage.setItem('purzasetu-all-users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('purzasetu-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('purzasetu-requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('purzasetu-completed-orders', JSON.stringify(completedOrders));
  }, [completedOrders]);

  useEffect(() => {
    localStorage.setItem('purzasetu-ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem('purzasetu-notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('purzasetu-reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('purzasetu-pending-shopkeepers', JSON.stringify(pendingShopkeepers));
  }, [pendingShopkeepers]);

  // Generate 4-digit booking code
  const generateBookingCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  useEffect(() => {
    if (user) localStorage.setItem('purzasetu-user', JSON.stringify(user));
    else localStorage.removeItem('purzasetu-user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('purzasetu-guest', isGuest);
  }, [isGuest]);

  useEffect(() => {
    localStorage.setItem('purzasetu-registration-open', isRegistrationOpen);
  }, [isRegistrationOpen]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
          console.warn('Geolocation access denied or failed. Using default coords.');
          // Use a default coordinate for demo purposes if denied
          setCoords({ lat: 28.6139, lng: 77.2090 });
        },
        { enableHighAccuracy: true, timeout: 5001, maximumAge: 0 }
      );
    }
  }, []);

  const login = (email, password, role) => {
    // Prioritize finding a VERIFIED user if duplicates exist (fixes shadowing bug)
    const foundUser = users.find(u => u.email === email && u.isVerified) || users.find(u => u.email === email);

    // Admin override for demo
    if (email === 'admin@purzasetu.com') {
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
    localStorage.removeItem('purzasetu-user');
    localStorage.removeItem('purzasetu-guest');
  };

  const updateProfile = async (updates) => {
    try {
      // Simulate Database Latency
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedUser = { ...user, ...updates };

      // Critical: Update both Current User AND the entry in the Global Registry
      setUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

      return { success: true };
    } catch (err) {
      console.error("Profile Update failed:", err);
      return { success: false };
    }
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

  const deleteProduct = async (id) => {
    // Simulate DB deletion
    await new Promise(resolve => setTimeout(resolve, 500));
    setProducts(prev => prev.filter(p => p.id !== id));
    setReports(prev => prev.filter(r => r.productId !== id));
    return { success: true };
  };

  const addProduct = async (product) => {
    // Simulate DB insertion
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProducts(prev => [product, ...prev]);
    return { success: true };
  };

  const updateProduct = async (id, updates) => {
    // Simulate DB update
    await new Promise(resolve => setTimeout(resolve, 600));
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    return { success: true };
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
    // Placeholder for SMTP integration - implement in production
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

  // Analytics Tracking Functions
  const trackProductView = (productId) => {
    // Check if this is a unique view for this session
    const sessionKey = `viewed_product_${productId}`;
    const hasViewed = sessionStorage.getItem(sessionKey);

    if (!hasViewed) {
      sessionStorage.setItem(sessionKey, Date.now().toString());

      setProducts(prev => prev.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            viewCount: (p.viewCount || 0) + 1,
            viewHistory: [...(p.viewHistory || []), Date.now()]
          };
        }
        return p;
      }));
    }
  };

  const trackShopVisit = (shopId) => {
    // Check if this is a unique visit for this session
    const sessionKey = `visited_shop_${shopId}`;
    const hasVisited = sessionStorage.getItem(sessionKey);

    if (!hasVisited) {
      sessionStorage.setItem(sessionKey, Date.now().toString());

      setUsers(prev => prev.map(u => {
        if (u.id === shopId && u.role === 'shopkeeper') {
          return {
            ...u,
            shopVisits: (u.shopVisits || 0) + 1,
            visitHistory: [...(u.visitHistory || []), Date.now()]
          };
        }
        return u;
      }));
    }
  };

  const isShopkeeper = user?.email === 'shop@purzasetu.com' || user?.role === 'shopkeeper';
  const isAdmin = user?.email === 'admin@purzasetu.com' || user?.role === 'Admin';

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
      isRegistrationOpen, toggleRegistration, trackProductView, trackShopVisit
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
