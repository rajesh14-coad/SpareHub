import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  User,
  PlusCircle,
  LayoutDashboard,
  Search as SearchIcon,
  Settings,
  PackagePlus,
  Compass,
  MessageSquare,
  Bell,
  Clock,
  Activity,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import { useChat } from '../context/ChatContext';
import SettingsDrawer from './SettingsDrawer';
import SearchOverlay from './SearchOverlay';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isGuest, isShopkeeper, notifications, markNotificationsAsRead } = useAuth();
  const { query, setQuery } = useSearch();
  const { totalUnreadCount } = useChat();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const hideFullNav = [
    '/',
    '/login',
    '/signup',
    '/admin',
    '/role-selection',
    '/admin-login',
    '/shopkeeper-signup'
  ].includes(location.pathname);

  if (hideFullNav) return null;

  return (
    <>
      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Desktop Navbar */}
      <nav className="hidden md:flex items-center justify-between px-10 py-4 glass fixed top-0 w-full z-50 border-b border-border-primary/50 shadow-sm">
        <Link to="/" className="text-2xl font-semibold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2 tracking-tight transition-all hover:opacity-90 hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] glow-effect">
          PurzaSetu
        </Link>

        {/* Global Search Interface */}
        {!isShopkeeper && (
          <div className="flex-1 max-w-sm mx-10 relative group">
            <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-brand-primary transition-colors" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (location.pathname !== '/customer/home') navigate('/customer/home');
              }}
              placeholder="Search spare parts..."
              className="w-full pl-11 pr-4 py-2.5 bg-bg-primary/50 border border-border-primary/50 rounded-2xl focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary/20 outline-none text-sm text-text-primary transition-all placeholder:text-text-secondary/50 placeholder:font-normal"
            />
          </div>
        )}

        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 mr-2 border-r border-border-primary/50 pr-4">
            {isShopkeeper ? (
              <>
                <NavLink to="/shop/dashboard" icon={<LayoutDashboard size={19} />} text="Dashboard" />
                <NavLink to="/shop/upload" icon={<PlusCircle size={19} />} text="Post Item" />
              </>
            ) : (
              <>
                <NavLink to="/customer/home" icon={<Compass size={19} />} text="Explore Parts" />
                {!isGuest && <NavLink to="/customer/requests" icon={<PackagePlus size={19} />} text="Requests" />}
              </>
            )}

            <NavLink
              to="/chats"
              icon={<MessageSquare size={19} />}
              text="Messages"
              badge={totalUnreadCount}
            />

            {/* Notifications Bell */}
            {!isGuest && (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    if (!isNotificationsOpen) markNotificationsAsRead();
                  }}
                  className={`p-3 rounded-2xl flex items-center justify-center transition-all hover:bg-bg-primary btn-press ${isNotificationsOpen ? 'text-brand-primary bg-brand-primary/5' : 'text-text-secondary'}`}
                >
                  <div className="relative">
                    <Bell size={19} />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-0.5 w-2 h-2 bg-brand-primary rounded-full border-2 border-bg-secondary" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsNotificationsOpen(false)} className="fixed inset-0 z-40" />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 top-14 w-80 glass-card z-50 overflow-hidden border border-border-primary shadow-2xl"
                      >
                        <div className="px-5 py-4 border-b border-border-primary/30 flex justify-between items-center bg-bg-primary/30">
                          <h4 className="text-xs font-semibold text-text-primary">Notifications</h4>
                          <Activity size={14} className="text-brand-primary" />
                        </div>
                        <div className="max-h-80 overflow-y-auto no-scrollbar">
                          {notifications.length > 0 ? notifications.map(n => {
                            // Determine navigation target based on notification content
                            const handleNotificationClick = () => {
                              setIsNotificationsOpen(false);

                              if (n.text.toLowerCase().includes('request') || n.type === 'request') {
                                // Navigate to Inventory Requests tab
                                navigate('/shop/dashboard');
                                // Note: In a real app, you'd also set the active tab to 'requests'
                              } else if (n.text.toLowerCase().includes('order') || n.text.toLowerCase().includes('completed')) {
                                // Navigate to History page
                                navigate('/profile');
                                // Note: In a real app, you'd also trigger the history modal to open
                              } else if (n.text.toLowerCase().includes('message')) {
                                navigate('/chats');
                              } else {
                                // Default: navigate to profile
                                navigate('/profile');
                              }
                            };

                            return (
                              <div
                                key={n.id}
                                onClick={handleNotificationClick}
                                className="p-4 hover:bg-bg-primary/50 transition-all cursor-pointer border-b border-border-primary/30 last:border-0 active:scale-[0.98]"
                              >
                                <div className="flex gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${n.type === 'request' ? 'bg-emerald-500/10 text-emerald-500' : n.type === 'signal' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-orange-500/10 text-orange-500'}`}>
                                    {n.type === 'request' ? <PlusCircle size={14} /> : n.type === 'signal' ? <Zap size={14} /> : <Activity size={14} />}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-xs text-text-primary leading-tight mb-1">{n.text}</p>
                                    <span className="text-[10px] text-text-secondary flex items-center gap-1 opacity-70">
                                      <Clock size={10} /> {n.time}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          }) : (
                            <div className="p-10 text-center text-text-secondary text-xs">
                              No new notifications
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}

            <Link to={isShopkeeper ? `/shop/profile/${user?.id}` : "/profile"} className="flex items-center gap-2 p-3 rounded-2xl hover:bg-bg-primary transition-all text-text-secondary hover:text-text-primary btn-press">
              <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <User size={18} />
              </div>
            </Link>
          </div>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 bg-bg-primary/50 text-text-secondary hover:text-brand-primary hover:bg-brand-primary/5 transition-all rounded-2xl btn-press"
          >
            <Settings size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - Floating Island Design */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 glass border border-border-primary/50 px-8 py-4 flex justify-between items-center z-50 rounded-[32px] shadow-lg">
        {isShopkeeper ? (
          <>
            <MobileNavLink to="/shop/dashboard" icon={<LayoutDashboard size={24} />} active={location.pathname === '/shop/dashboard'} />
            <MobileNavLink to="/shop/upload" icon={<PlusCircle size={24} />} active={location.pathname === '/shop/upload'} />
            <MobileNavLink to="/chats" icon={<MessageSquare size={24} />} active={location.pathname.startsWith('/chat')} badge={totalUnreadCount} />
            <MobileNavLink to={isShopkeeper ? `/shop/profile/${user?.id}` : "/profile"} icon={<User size={24} />} active={location.pathname === (isShopkeeper ? `/shop/profile/${user?.id}` : "/profile")} />
          </>
        ) : (
          <>
            <MobileNavLink to="/customer/home" icon={<Home size={24} />} active={location.pathname === '/customer/home'} />
            <button onClick={() => setIsSearchOpen(true)} className="p-2 text-text-secondary btn-press">
              <SearchIcon size={24} />
            </button>
            <MobileNavLink to="/chats" icon={<MessageSquare size={24} />} active={location.pathname.startsWith('/chat')} badge={totalUnreadCount} />
            <MobileNavLink to={isShopkeeper ? `/shop/profile/${user?.id}` : "/profile"} icon={<User size={24} />} active={location.pathname === (isShopkeeper ? `/shop/profile/${user?.id}` : "/profile")} />
          </>
        )}
      </nav>
    </>
  );
};

const NavLink = ({ to, icon, text, badge }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all relative btn-press ${isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'}`}>
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-xs font-medium tracking-tight whitespace-nowrap">{text}</span>
      {badge > 0 && (
        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-primary rounded-full shadow-sm" />
      )}
    </Link>
  );
};

const MobileNavLink = ({ to, icon, active, badge }) => (
  <Link to={to} className={`relative flex flex-col items-center gap-1 btn-press transition-colors ${active ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}>
    <motion.div
      animate={active ? { scale: 1.1 } : { scale: 1 }}
      className="p-1"
    >
      {icon}
    </motion.div>
    {badge > 0 && (
      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-primary rounded-full border-2 border-bg-secondary shadow-sm" />
    )}
    {active && (
      <motion.div
        layoutId="activeIndicator"
        className="w-1 h-1 bg-brand-primary rounded-full absolute -bottom-2 shadow-[0_0_8px_rgba(79,70,229,0.8)]"
      />
    )}
  </Link>
);

export default Navbar;

