import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Globe, UserCheck, Store } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminPasswordModal from '../components/AdminPasswordModal';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, continueAsGuest, googleLogin } = useAuth();

  // Normalize role from state (e.g., 'shopkeeper' -> 'Shopkeeper')
  const initialRole = location.state?.role
    ? location.state.role.charAt(0).toUpperCase() + location.state.role.slice(1)
    : 'Customer';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password, role);
    if (result && result.success) {
      navigate('/');
    } else if (result) {
      toast.error(result.message);
    }
  };

  const handleGuestMode = () => {
    continueAsGuest();
    navigate('/');
  };

  const handleGoogleLogin = () => {
    googleLogin();
    navigate('/');
  };

  const handleAdminSuccess = () => {
    login('admin@purzasetu.com', 'admin', 'Admin');
    navigate('/');
    toast.success("Welcome back, Overseer");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-brand-primary/30">
      {/* Animated Mesh Gradient Background */}
      <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob ${role === 'Shopkeeper' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
      <div className={`absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000 ${role === 'Shopkeeper' ? 'bg-teal-500' : 'bg-blue-500'}`} />
      <div className={`absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-4000 ${role === 'Shopkeeper' ? 'bg-green-500' : 'bg-purple-500'}`} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`w-20 h-20 mx-auto mb-6 rounded-[2rem] flex items-center justify-center shadow-2xl flex-shrink-0 ${role === 'Shopkeeper' ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30' : 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-500/30'}`}
          >
            <Store className="text-white w-10 h-10" />
          </motion.div>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
            {role === 'Shopkeeper' ? 'Authorized Access' : 'Secure Entry'}
          </h2>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {role === 'Shopkeeper' ? 'Partner Portal' : <>Welcome to <span className="brand-logo">PurzaSetu</span></>}
          </h1>
        </div>

        <div className="backdrop-blur-3xl bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
          {/* Internal Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Identity</label>
              <div className="relative group/input">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within/input:text-white" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-900/50 py-4 pl-14 pr-6 rounded-2xl border border-white/5 outline-none text-white font-bold placeholder:text-slate-600 focus:border-white/20 focus:bg-slate-900/80 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Passcode</label>
              </div>
              <div className="relative group/input">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within/input:text-white" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-900/50 py-4 pl-14 pr-6 rounded-2xl border border-white/5 outline-none text-white font-bold placeholder:text-slate-600 focus:border-white/20 focus:bg-slate-900/80 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 transition-all ${role === 'Shopkeeper'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/20 hover:shadow-emerald-500/40'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/20 hover:shadow-blue-500/40'
                }`}
            >
              Initiate Session <LogIn size={16} />
            </motion.button>
          </form>

          {role === 'Customer' && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Or Continue With</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleGoogleLogin()}
                  className="py-3.5 px-4 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-white flex items-center justify-center gap-2 transition-all hover:border-white/20"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-4 h-4" />
                  Google
                </motion.button>
                <motion.button
                  whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGuestMode}
                  className="py-3.5 px-4 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-white flex items-center justify-center gap-2 transition-all hover:border-white/20"
                >
                  <Globe size={16} className="text-blue-400" />
                  Guest Mode
                </motion.button>
              </div>
            </div>
          )}

          <div className="mt-10 text-center">
            {role === 'Shopkeeper' ? (
              <p className="text-xs font-bold text-slate-400">
                New partner?
                <Link to="/shopkeeper-signup" className="ml-2 text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider text-[10px] font-black">
                  Register Shop
                </Link>
              </p>
            ) : (
              <p className="text-xs font-bold text-slate-400">
                No account?
                <Link to="/signup" className="ml-2 text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider text-[10px] font-black">
                  Join The Hub
                </Link>
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 text-center flex justify-center gap-6">
          <button
            onClick={() => navigate('/role-selection')}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-white transition-colors flex items-center gap-2"
          >
            <UserCheck size={14} /> Switch Role
          </button>
          <button
            onClick={() => setShowAdminModal(true)}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-white transition-colors"
          >
            Root Access (Dev)
          </button>
        </div>
      </motion.div>

      <AdminPasswordModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onConfirm={handleAdminSuccess}
      />

      {/* CSS Animation for Blob Background */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;
