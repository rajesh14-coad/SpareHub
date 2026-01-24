import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Lock, Eye, EyeOff, Store, Package, Clock,
  MapPin, ArrowLeft, ArrowRight, Check, Loader2, Calendar, Crosshair
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ShopkeeperSignup = () => {
  const navigate = useNavigate();
  const { submitShopkeeperRequest } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Details
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',

    // Shop Details
    shopName: '',
    shopType: '',
    customShopType: '',
    productsDealtIn: '',

    // Business Hours
    openingTime: '08:00',
    closingTime: '18:00',
    workingDays: [],

    // Location
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [errors, setErrors] = useState({});

  const shopTypes = [
    'Car Spare Parts Shop',
    'Bike Spare Parts Shop',
    'Electric Scooty Shop (EV)',
    'Mobile & Gadget Shop',
    'Car/Bike Service Center',
    'Old/Used Parts Shop (Scrap)',
    'AC & Refrigeration Shop',
    'Old AC/Appliance Shop',
    'Other / Custom'
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
      else if (formData.phone.length !== 10) newErrors.phone = 'Phone must be 10 digits';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    if (step === 2) {
      if (!formData.shopName.trim()) newErrors.shopName = 'Shop name is required';
      if (!formData.shopType) newErrors.shopType = 'Shop type is required';
      if (formData.shopType === 'Other / Custom' && !formData.customShopType?.trim()) {
        newErrors.customShopType = 'Please specify your shop type';
      }
      if (!formData.productsDealtIn.trim()) newErrors.productsDealtIn = 'Products dealt in is required';
    }

    if (step === 3) {
      if (!formData.openingTime) newErrors.openingTime = 'Opening time is required';
      if (!formData.closingTime) newErrors.closingTime = 'Closing time is required';
      if (formData.workingDays.length === 0) newErrors.workingDays = 'Select at least one working day';
    }

    if (step === 4) {
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleWorkingDay = (day) => {
    setFormData(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsLoading(true);

    // Prepare final data (merge custom shop type if needed)
    const finalData = {
      ...formData,
      shopType: formData.shopType === 'Other / Custom' ? formData.customShopType : formData.shopType
    };

    // Simulate API call
    setTimeout(() => {
      submitShopkeeperRequest(finalData);
      setIsLoading(false);
      setShowSuccessModal(true);
    }, 1500);
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      const toastId = toast.loading("Detecting location...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate Reverse Geocoding
          setTimeout(() => {
            setFormData(prev => ({
              ...prev,
              address: '123, Auto Market, Sector 18',
              city: 'New Delhi',
              state: 'Delhi',
              pincode: '110001'
            }));
            toast.success("Location Detected", { id: toastId });
          }, 1500);
        },
        (error) => {
          toast.error("Location access denied", { id: toastId });
        }
      );
    } else {
      toast.error("Geolocation not supported");
    }
  };

  const steps = [
    { number: 1, title: 'Personal Details', icon: <User size={20} /> },
    { number: 2, title: 'Shop Details', icon: <Store size={20} /> },
    { number: 3, title: 'Business Hours', icon: <Clock size={20} /> },
    { number: 4, title: 'Location', icon: <MapPin size={20} /> }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg-primary">
      <div className="max-w-3xl w-full">
        {/* Header ... */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/role-selection')}
            className="mb-6 p-2 text-text-secondary hover:text-brand-primary transition-all flex items-center gap-2 text-sm font-semibold"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <h1 className="text-4xl font-bold text-text-primary tracking-tight mb-2">
            Shopkeeper Registration
          </h1>
          <p className="text-text-secondary font-medium opacity-70">
            Join SpareHub and start selling your products
          </p>
        </div>

        {/* Progress Steps ... */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${currentStep >= step.number
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30'
                    : 'bg-bg-secondary text-text-secondary border border-border-primary'
                    }`}>
                    {currentStep > step.number ? <Check size={20} /> : step.icon}
                  </div>
                  <p className={`text-xs font-bold text-center ${currentStep >= step.number ? 'text-brand-primary' : 'text-text-secondary opacity-50'
                    }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-8 transition-all ${currentStep > step.number ? 'bg-brand-primary' : 'bg-border-primary'
                    }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="glass-card p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <FormField
                  label="Full Name"
                  icon={<User size={18} />}
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                  placeholder="Enter your full name"
                />

                <FormField
                  label="Phone Number"
                  icon={<Phone size={18} />}
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={errors.phone}
                  placeholder="9876543210"
                  prefix="+91"
                  maxLength={10}
                />

                <FormField
                  label="Email Address"
                  icon={<Mail size={18} />}
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  placeholder="your@email.com"
                />

                <FormField
                  label="Password"
                  icon={<Lock size={18} />}
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={errors.password}
                  placeholder="Min 6 characters"
                  showToggle
                  showValue={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                />

                <FormField
                  label="Confirm Password"
                  icon={<Lock size={18} />}
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={errors.confirmPassword}
                  placeholder="Re-enter password"
                  showToggle
                  showValue={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </motion.div>
            )}

            {/* Step 2: Shop Details */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <FormField
                  label="Shop Name"
                  icon={<Store size={18} />}
                  type="text"
                  value={formData.shopName}
                  onChange={(e) => handleInputChange('shopName', e.target.value)}
                  error={errors.shopName}
                  placeholder="Enter your shop name"
                />

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60">
                    Category of Shop
                  </label>
                  <select
                    value={formData.shopType}
                    onChange={(e) => handleInputChange('shopType', e.target.value)}
                    className={`w-full px-4 py-3 bg-bg-primary/50 border ${errors.shopType ? 'border-red-500' : 'border-border-primary'} rounded-xl outline-none focus:border-brand-primary/50 text-sm font-semibold transition-all glow-effect`}
                  >
                    <option value="">Select Category</option>
                    {shopTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.shopType && <p className="text-xs font-medium text-red-500">{errors.shopType}</p>}
                </div>

                {/* Custom Category Input */}
                <AnimatePresence>
                  {formData.shopType === 'Other / Custom' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <label className="text-xs font-bold text-brand-primary uppercase tracking-widest">
                        Specify Your Shop Type
                      </label>
                      <input
                        type="text"
                        value={formData.customShopType}
                        onChange={(e) => handleInputChange('customShopType', e.target.value)}
                        placeholder="e.g. Vintage Car Restoration..."
                        className="w-full px-4 py-3 bg-white/5 border border-brand-primary/50 rounded-xl outline-none focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] text-sm font-bold transition-all text-text-primary"
                      />
                      {errors.customShopType && <p className="text-xs font-medium text-red-500">{errors.customShopType}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60">
                    Products Dealt In
                  </label>
                  <textarea
                    value={formData.productsDealtIn}
                    onChange={(e) => handleInputChange('productsDealtIn', e.target.value)}
                    className={`w-full px-4 py-3 bg-bg-primary/50 border ${errors.productsDealtIn ? 'border-red-500' : 'border-border-primary'} rounded-xl outline-none focus:border-brand-primary/50 text-sm font-semibold transition-all glow-effect resize-none`}
                    rows={4}
                    placeholder="e.g., Car headlights, brake pads, engine parts..."
                  />
                  {errors.productsDealtIn && <p className="text-xs font-medium text-red-500">{errors.productsDealtIn}</p>}
                </div>
              </motion.div>
            )}

            {/* Step 3: Business Hours */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Opening Time"
                    icon={<Clock size={18} />}
                    type="time"
                    value={formData.openingTime}
                    onChange={(e) => handleInputChange('openingTime', e.target.value)}
                    error={errors.openingTime}
                  />

                  <FormField
                    label="Closing Time"
                    icon={<Clock size={18} />}
                    type="time"
                    value={formData.closingTime}
                    onChange={(e) => handleInputChange('closingTime', e.target.value)}
                    error={errors.closingTime}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60">
                    Working Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {weekDays.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleWorkingDay(day)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${formData.workingDays.includes(day)
                          ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                          : 'bg-bg-primary border border-border-primary text-text-secondary'
                          }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  {errors.workingDays && <p className="text-xs font-medium text-red-500">{errors.workingDays}</p>}
                </div>
              </motion.div>
            )}

            {/* Step 4: Location */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60">
                      Shop Address
                    </label>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      className="text-[10px] font-bold text-brand-primary flex items-center gap-1 hover:text-brand-light transition-colors py-1 px-2 rounded-lg hover:bg-brand-primary/10"
                    >
                      <Crosshair size={14} /> Detect My Location
                    </button>
                  </div>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-4 py-3 bg-bg-primary/50 border ${errors.address ? 'border-red-500' : 'border-border-primary'} rounded-xl outline-none focus:border-brand-primary/50 text-sm font-semibold transition-all glow-effect resize-none`}
                    rows={3}
                    placeholder="Enter complete shop address"
                  />
                  {errors.address && <p className="text-xs font-medium text-red-500">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="City"
                    icon={<MapPin size={18} />}
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    error={errors.city}
                    placeholder="City name"
                  />

                  <FormField
                    label="State"
                    icon={<MapPin size={18} />}
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    error={errors.state}
                    placeholder="State name"
                  />
                </div>

                <FormField
                  label="Pincode"
                  icon={<MapPin size={18} />}
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  error={errors.pincode}
                  placeholder="6-digit pincode"
                  maxLength={6}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 glass text-text-primary rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-bg-primary transition-all"
              >
                <ArrowLeft size={18} /> Back
              </button>
            )}

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 glow-effect pulse-on-hover"
              >
                Next <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 glow-effect pulse-on-hover disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Request <Check size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[150] p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md glass-card p-8 text-center"
            >
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} />
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-3">Request Sent!</h2>
              <p className="text-text-secondary font-medium mb-8 leading-relaxed">
                Our Admin will verify your shop within 24 hours. You'll receive an email once approved.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 bg-white/5 text-text-primary border border-border-primary/50 rounded-xl font-bold text-sm shadow-lg hover:bg-white/10 transition-all"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => navigate('/login', { state: { role: 'shopkeeper' } })}
                  className="w-full py-3 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20"
                >
                  Go to Login
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FormField = ({ label, icon, type, value, onChange, error, placeholder, prefix, maxLength, showToggle, showValue, onToggle }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
        {icon}
      </div>
      {prefix && (
        <div className="absolute left-12 top-1/2 -translate-y-1/2 text-text-secondary font-bold text-sm">
          {prefix}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={`w-full ${prefix ? 'pl-20' : 'pl-12'} ${showToggle ? 'pr-12' : 'pr-4'} py-3 bg-bg-primary/50 border ${error ? 'border-red-500' : 'border-border-primary'} rounded-xl outline-none focus:border-brand-primary/50 text-sm font-semibold transition-all glow-effect`}
        placeholder={placeholder}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
        >
          {showValue ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
    {error && <p className="text-xs font-medium text-red-500">{error}</p>}
  </div>
);

export default ShopkeeperSignup;
