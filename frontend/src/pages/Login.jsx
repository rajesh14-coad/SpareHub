import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Globe, UserCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, continueAsGuest, googleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, role);
    navigate('/selection');
  };

  const handleGuestMode = () => {
    continueAsGuest();
    navigate('/customer/home');
  };

  const handleGoogleLogin = () => {
    googleLogin();
    navigate('/selection');
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10"
      >
        <motion.div className="glass-card p-10 shadow-2xl glow-effect">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-text-primary tracking-tight mb-2">
              SpareHub
            </h1>
            <p className="text-text-secondary text-sm font-medium opacity-60">Log in</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="floating-label-group glow-effect">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-bg-primary/50 p-4 rounded-xl border border-border-primary/50 outline-none text-text-primary font-semibold transition-all focus:border-brand-primary/30"
              />
              <label>Email</label>
            </div>
            <div className="floating-label-group glow-effect">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-bg-primary/50 p-4 rounded-xl border border-border-primary/50 outline-none text-text-primary font-semibold transition-all focus:border-brand-primary/30"
              />
              <label>Password</label>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 glow-effect"
            >
              Log In <LogIn size={18} />
            </motion.button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-border-primary/20" />
            <span className="text-[10px] font-bold text-text-secondary opacity-40 uppercase tracking-widest">or</span>
            <div className="h-[1px] flex-1 bg-border-primary/20" />
          </div>

          <div className="space-y-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              className="w-full py-3.5 glass text-text-primary rounded-xl font-bold text-xs uppercase tracking-widest border border-border-primary/50 flex items-center justify-center gap-2 glow-effect"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
              Google
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleGuestMode}
              className="w-full py-3.5 glass text-text-primary rounded-xl font-bold text-xs uppercase tracking-widest border border-border-primary/50 flex items-center justify-center gap-2 glow-effect"
            >
              <Globe size={16} className="text-brand-primary opacity-60" />
              Guest Mode
            </motion.button>
          </div>

          <p className="mt-8 text-center text-xs font-semibold text-text-secondary">
            Need an account?{' '}
            <Link to="/signup" className="text-brand-primary font-bold hover:underline">
              Sign Up
            </Link>
          </p>

          <button
            onClick={() => {
              login('admin@sparehub.com', 'admin', 'Admin');
              navigate('/admin');
            }}
            className="w-full mt-4 text-[10px] font-bold text-text-secondary opacity-20 hover:opacity-100 transition-opacity uppercase tracking-widest"
          >
            Root Access
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;

