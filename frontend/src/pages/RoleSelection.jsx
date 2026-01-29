import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Store, Shield, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminPasswordModal from '../components/AdminPasswordModal';
import toast from 'react-hot-toast';

const RoleSelection = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showAdminModal, setShowAdminModal] = useState(false);

  const handleAdminSuccess = () => {
    login('admin@purzasetu.com', 'admin', 'Admin');
    navigate('/admin'); // Or wherever admin goes
    toast.success("Welcome, System Overseer");
  };

  const roles = [
    {
      id: 'customer',
      title: 'Customer',
      description: 'Browse & Buy Parts',
      icon: <ShoppingBag size={40} />,
      color: 'from-blue-500 to-indigo-600',
      path: '/login'
    },
    {
      id: 'shopkeeper',
      title: 'Shopkeeper',
      description: 'Sell Your Products',
      icon: <Store size={40} />,
      color: 'from-emerald-500 to-teal-600',
      path: '/shopkeeper-signup'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 bg-brand-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-primary/30">
            <Store size={40} className="text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-text-primary tracking-tight mb-4 leading-tight">
            Welcome to <span className="brand-logo">PurzaSetu</span>
          </h1>
          <p className="text-lg text-text-secondary font-medium opacity-70">
            Choose how you'd like to continue
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card p-8 group relative overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

              <div className="relative z-10">
                <div className={`w-20 h-20 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {role.icon}
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-text-primary mb-2 tracking-tight">
                  {role.title}
                </h2>
                <p className="text-text-secondary font-medium mb-8 opacity-70">
                  {role.description}
                </p>

                {role.id === 'shopkeeper' ? (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => navigate('/shopkeeper-signup')}
                      className="w-full py-3.5 bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      Register Shop <ArrowRight size={18} />
                    </button>
                    <button
                      onClick={() => navigate('/login', { state: { role: 'shopkeeper' } })}
                      className="w-full py-3 text-text-secondary hover:text-emerald-500 font-bold text-xs uppercase tracking-widest transition-colors border border-border-primary/50 rounded-xl hover:border-emerald-500/30"
                    >
                      Existing Shop? Login
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => navigate(role.path, { state: { role: 'customer' } })}
                    className="flex items-center gap-2 text-brand-primary font-bold text-sm group-hover:gap-4 transition-all cursor-pointer"
                  >
                    Continue <ArrowRight size={18} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Admin Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={() => setShowAdminModal(true)}
            className="text-text-secondary hover:text-brand-primary transition-colors text-sm font-medium flex items-center gap-2 mx-auto opacity-50 hover:opacity-100"
          >
            <Shield size={14} />
            Admin Access
          </button>
        </motion.div>
      </div>

      <AdminPasswordModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onConfirm={handleAdminSuccess}
      />
    </div>
  );
};

export default RoleSelection;
