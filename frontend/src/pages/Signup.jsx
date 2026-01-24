import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ChevronRight, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, continueAsGuest } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData.name, formData.email, formData.password, 'Customer');
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
              Join
            </h1>
            <p className="text-text-secondary text-sm font-medium opacity-60">Create account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="floating-label-group glow-effect">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-bg-primary/50 p-4 rounded-xl border border-border-primary/50 outline-none text-text-primary font-semibold transition-all focus:border-brand-primary/30"
              />
              <label>Full Name</label>
            </div>
            <div className="floating-label-group glow-effect">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-bg-primary/50 p-4 rounded-xl border border-border-primary/50 outline-none text-text-primary font-semibold transition-all focus:border-brand-primary/30"
              />
              <label>Email</label>
            </div>
            <div className="floating-label-group glow-effect">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-bg-primary/50 p-4 rounded-xl border border-border-primary/50 outline-none text-text-primary font-semibold transition-all focus:border-brand-primary/30"
              />
              <label>Password</label>
            </div>

            <div className="flex items-center gap-2 px-1">
              <input type="checkbox" id="terms" className="rounded-md accent-brand-primary w-4 h-4 border-none bg-bg-primary focus:ring-0" required />
              <label htmlFor="terms" className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
                Accept <span className="text-brand-primary font-bold">Terms</span>
              </label>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 glow-effect"
            >
              Sign Up <ChevronRight size={18} />
            </motion.button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-border-primary/20" />
            <span className="text-[10px] font-bold text-text-secondary opacity-40 uppercase tracking-widest">or</span>
            <div className="h-[1px] flex-1 bg-border-primary/20" />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              continueAsGuest();
              navigate('/selection');
            }}
            className="w-full py-3.5 glass text-text-primary rounded-xl font-bold text-xs uppercase tracking-widest border border-border-primary/50 flex items-center justify-center gap-2 glow-effect"
          >
            <Globe size={16} className="text-brand-primary opacity-60" />
            Guest Mode
          </motion.button>

          <p className="mt-8 text-center text-xs font-semibold text-text-secondary">
            Already a member?{' '}
            <Link to="/login" className="text-brand-primary font-bold hover:underline">
              Log In
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
