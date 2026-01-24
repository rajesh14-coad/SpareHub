import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  ChevronRight,
  ChevronLeft,
  Upload,
  Tag,
  CheckCircle2,
  IndianRupee,
  Image as ImageIcon,
  Info,
  Loader2,
  Plus,
  ArrowLeft,
  X,
  Smartphone,
  Tablet,
  Laptop,
  Headphones,
  HardDrive,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UploadPart = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Spare Parts',
    customCategory: '',
    condition: 'new',
    price: '',
    image: null,
    stock: 1
  });

  const categories = [
    { id: 'Mobile', name: 'Mobile', icon: <Smartphone size={18} /> },
    { id: 'Tablets', name: 'Tablets', icon: <Tablet size={18} /> },
    { id: 'Laptops', name: 'Laptops', icon: <Laptop size={18} /> },
    { id: 'Spare Parts', name: 'Spare Parts', icon: <HardDrive size={18} /> },
    { id: 'Accessories', name: 'Accessories', icon: <Headphones size={18} /> },
    { id: 'Electronics', name: 'Electronics', icon: <Settings size={18} /> },
  ];

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const isStepValid = () => {
    if (step === 1) return formData.name.length > 2 && formData.description.length > 5;
    if (step === 2) {
      if (showCustomCategory) return formData.customCategory.length > 2;
      return !!formData.category;
    }
    if (step === 3) return formData.price > 0 && formData.image;
    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      setStep(4);
      setTimeout(() => {
        navigate('/shop/dashboard');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="pt-24 pb-32 px-4 md:px-8 max-w-4xl mx-auto min-h-screen">
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => step > 1 ? prevStep() : navigate(-1)} className="p-2 text-text-secondary hover:text-brand-primary transition-all btn-press">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Post Item
          </h1>
        </div>
        {/* Progress Bar */}
        <div className="flex gap-2 max-w-xs mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-brand-primary' : 'bg-border-primary/20'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="glass-card p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary"><Package size={18} /></div>
                <h2 className="text-xl font-bold text-text-primary tracking-tight">Item Details</h2>
              </div>

              <div className="floating-label-group">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-bg-primary/50 p-4 rounded-xl border border-border-primary/50 outline-none text-text-primary font-semibold transition-all focus:border-brand-primary/30"
                />
                <label>Item Name</label>
              </div>

              <div className="floating-label-group">
                <textarea
                  rows="4"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-bg-primary/50 p-4 rounded-xl border border-border-primary/50 outline-none text-text-primary font-semibold transition-all focus:border-brand-primary/30 resize-none"
                />
                <label>Description</label>
              </div>
            </div>

            <button
              disabled={!isStepValid()}
              onClick={nextStep}
              className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/20 disabled:opacity-50 flex items-center justify-center gap-2 btn-press"
            >
              Next Step <ChevronRight size={18} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            <div className="glass-card p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary"><Tag size={18} /></div>
                <h2 className="text-xl font-bold text-text-primary tracking-tight">Category</h2>
              </div>

              <div className="relative">
                <select
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({ ...formData, category: e.target.value });
                    setShowCustomCategory(e.target.value === 'custom');
                  }}
                  className="w-full bg-bg-primary/50 p-4 rounded-xl border border-border-primary/50 outline-none text-text-primary font-bold appearance-none cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                  <option value="custom">+ Custom Category</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={18} />
              </div>

              {showCustomCategory && (
                <div className="floating-label-group">
                  <input
                    type="text"
                    placeholder="Custom Category"
                    value={formData.customCategory}
                    onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                    className="w-full bg-bg-primary/50 p-4 rounded-xl border border-brand-primary/30 outline-none text-text-primary font-semibold"
                  />
                  <label>Custom Category Name</label>
                </div>
              )}

              <div className="flex p-1 bg-bg-primary/50 rounded-xl border border-border-primary/50">
                {['new', 'used'].map(c => (
                  <button
                    key={c}
                    onClick={() => setFormData({ ...formData, condition: c })}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-all ${formData.condition === c ? 'bg-white text-brand-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                  >
                    {c === 'new' ? 'New' : 'Used'}
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={!isStepValid()}
              onClick={nextStep}
              className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 btn-press"
            >
              Next Step <ChevronRight size={18} />
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            <div className="glass-card p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary"><ImageIcon size={18} /></div>
                <h2 className="text-xl font-bold text-text-primary tracking-tight">Price & Photos</h2>
              </div>

              <div className="relative group p-12 border border-dashed border-border-primary/50 rounded-2xl bg-bg-primary/30 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-brand-primary/5 transition-all"
                onClick={() => !formData.image && fileInputRef.current.click()}
              >
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

                {formData.image ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden group">
                    <img src={formData.image} className="w-full h-full object-cover" />
                    <button onClick={removeImage} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg shadow-lg">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-white rounded-full text-brand-primary shadow-sm"><Upload size={24} /></div>
                    <p className="text-sm font-semibold text-text-primary">Click to upload photo</p>
                    <p className="text-xs text-text-secondary opacity-60">PNG, JPG up to 5MB</p>
                  </>
                )}
              </div>

              <div className="floating-label-group">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-brand-primary">₹</span>
                  <input
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-bg-primary/50 pl-10 pr-4 py-4 rounded-xl border border-border-primary/50 outline-none text-2xl font-bold text-text-primary transition-all focus:border-brand-primary/30"
                  />
                </div>
                <label>Price (INR)</label>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isStepValid() || isUploading}
              className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 btn-press"
            >
              {isUploading ? <Loader2 size={20} className="animate-spin" /> : "Post Item"}
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-10 text-center space-y-6 max-w-lg mx-auto"
          >
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={40} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-text-primary tracking-tight mb-2">Item Posted!</h2>
              <p className="text-sm font-medium text-text-secondary opacity-70">
                Your item "{formData.name}" is now visible to customers. Redirecting to dashboard...
              </p>
            </div>
            <div className="flex justify-center gap-1.5 pt-4">
              {[0, 1, 2].map(i => (
                <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadPart;

