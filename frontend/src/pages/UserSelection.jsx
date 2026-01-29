import React from 'react';
import { motion } from 'framer-motion';
import { User, Store, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserSelection = () => {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();

  const handleSelection = (role) => {
    updateProfile({ role });
    if (role === 'Shopkeeper') {
      navigate('/shop/dashboard');
    } else {
      navigate('/customer/home');
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative z-10"
      >
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary">
            <Sparkles size={24} />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-2">
          Choose Your Role
        </h1>
        <p className="text-text-secondary text-sm font-medium opacity-60">Select how you want to use PurzaSetu</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl relative z-10">
        <SelectionCard
          icon={<User size={32} />}
          title="Customer"
          description="Browse nearby parts, raise requests, and track maintenance"
          onClick={() => handleSelection('Customer')}
          details={["Search Parts", "Live Bidding", "Digital Garage"]}
        />
        <SelectionCard
          icon={<Store size={32} />}
          title="Shopkeeper"
          description="List inventory, fulfill requests, and scale your business"
          onClick={() => handleSelection('Shopkeeper')}
          details={["Inventory", "Analytics", "Direct Connect"]}
          premium
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-text-secondary font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 bg-white/5 border border-border-primary/50 px-6 py-2 rounded-full"
      >
        <ShieldCheck size={14} className="text-emerald-500 opacity-60" /> Secure Session
      </motion.div>
    </div>
  );
};

const SelectionCard = ({ icon, title, description, onClick, details, premium }) => (
  <motion.div
    onClick={onClick}
    className="glass-card p-8 cursor-pointer group hover:bg-bg-primary/30 transition-all relative overflow-hidden btn-press"
  >
    {premium && (
      <div className="absolute top-6 right-6">
        <div className="bg-brand-primary/10 text-brand-primary text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-brand-primary/20">
          Professional
        </div>
      </div>
    )}

    <div className="w-16 h-16 bg-bg-primary/50 rounded-2xl flex items-center justify-center mb-6 text-brand-primary border border-border-primary/50 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
      {icon}
    </div>

    <h2 className="text-2xl font-bold text-text-primary mb-3 tracking-tight">{title}</h2>
    <p className="text-text-secondary text-sm font-medium mb-6 leading-relaxed opacity-70">{description}</p>

    <div className="flex flex-wrap gap-2 mb-8">
      {details.map((d, i) => (
        <span key={i} className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 bg-white/5 text-text-secondary rounded-lg border border-border-primary/20">
          {d}
        </span>
      ))}
    </div>

    <div className="flex items-center gap-2 text-brand-primary font-bold uppercase tracking-widest text-[10px]">
      Initialize <ArrowRight size={14} />
    </div>
  </motion.div>
);

export default UserSelection;

