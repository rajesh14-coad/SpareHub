import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, Loader2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SettingsModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation only if user is trying to change password
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password required';
      }
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      toast.success('Profile Updated Successfully!');
      setIsLoading(false);

      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    }, 1500);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[150] p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl glass-card relative p-8 max-h-[90vh] overflow-y-auto no-scrollbar border border-border-primary/30"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border-primary/20">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-bg-primary rounded-lg text-text-secondary transition-all"
                >
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold text-text-primary tracking-tight">Account Settings</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-bg-primary rounded-lg text-text-secondary transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* General Information Section */}
            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <User size={18} className="text-brand-primary" />
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">General Information</h3>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-bg-primary/50 border ${errors.name ? 'border-red-500' : 'border-border-primary'} rounded-xl outline-none focus:border-brand-primary/50 text-sm font-semibold transition-all glow-effect`}
                    placeholder="Enter your name"
                  />
                </div>
                {errors.name && <p className="text-xs font-medium text-red-500">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-12 pr-12 py-3 bg-bg-primary/50 border ${errors.email ? 'border-red-500' : 'border-border-primary'} rounded-xl outline-none focus:border-brand-primary/50 text-sm font-semibold transition-all glow-effect`}
                    placeholder="your@email.com"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                    <CheckCircle size={18} />
                  </div>
                </div>
                {errors.email && <p className="text-xs font-medium text-red-500">{errors.email}</p>}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                    <Phone size={18} />
                  </div>
                  <div className="absolute left-12 top-1/2 -translate-y-1/2 text-text-secondary font-bold text-sm">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-20 pr-4 py-3 bg-bg-primary/50 border border-border-primary rounded-xl outline-none focus:border-brand-primary/50 text-sm font-semibold transition-all glow-effect"
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="pt-8 border-t border-border-primary/20 space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={18} className="text-brand-primary" />
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">Security & Password</h3>
              </div>

              {/* Current Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    className={`w-full pl-12 pr-12 py-3 bg-bg-primary/50 border ${errors.currentPassword ? 'border-red-500' : 'border-border-primary'} rounded-xl outline-none focus:border-brand-primary/50 text-sm font-semibold transition-all glow-effect`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.currentPassword && <p className="text-xs font-medium text-red-500">{errors.currentPassword}</p>}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className={`w-full pl-12 pr-12 py-3 bg-bg-primary/50 border ${errors.newPassword ? 'border-red-500' : 'border-border-primary'} rounded-xl outline-none focus:border-brand-primary/50 text-sm font-semibold transition-all glow-effect`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword && <p className="text-xs font-medium text-red-500">{errors.newPassword}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full pl-12 pr-12 py-3 bg-bg-primary/50 border ${errors.confirmPassword ? 'border-red-500' : 'border-border-primary'} rounded-xl outline-none focus:border-brand-primary/50 text-sm font-semibold transition-all glow-effect`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs font-medium text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isLoading}
              className="w-full mt-8 py-4 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2 glow-effect disabled:opacity-50 disabled:cursor-not-allowed pulse-on-hover"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
