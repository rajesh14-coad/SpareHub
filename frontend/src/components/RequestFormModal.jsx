import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, DollarSign, MapPin, Package, Zap, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const RequestFormModal = ({ isOpen, onClose, user, location }) => {
  const [formData, setFormData] = useState({
    partName: '',
    vehicleModel: '',
    category: 'Car Parts',
    condition: 'New',
    description: '',
    budgetMin: '',
    budgetMax: '',
    referencePhoto: null
  });

  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const categories = [
    'Car Parts',
    'Bike Parts',
    'Electric Car Parts',
    'Electric Scooty Parts',
    'Mobile',
    'Tablets',
    'Laptops',
    'Spare Parts',
    'Accessories',
    'Electronics'
  ];

  const conditions = ['New', 'Used', 'Reconditioned'];

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'purzasetu_requests'); // You need to create this preset in Cloudinary
      formData.append('cloud_name', 'YOUR_CLOUD_NAME'); // Replace with your Cloudinary cloud name

      // Upload to Cloudinary
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', // Replace YOUR_CLOUD_NAME
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        setFormData(prev => ({ ...prev, referencePhoto: data.secure_url }));
        setPhotoPreview(data.secure_url);
        toast.success('Photo uploaded successfully!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.partName || !formData.vehicleModel) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.budgetMin || !formData.budgetMax) {
      toast.error('Please set a budget range');
      return;
    }

    if (parseInt(formData.budgetMin) > parseInt(formData.budgetMax)) {
      toast.error('Minimum budget cannot be greater than maximum budget');
      return;
    }

    if (!location.state || !location.district) {
      toast.error('Please set your location first');
      return;
    }

    try {
      const requestData = {
        customer: user?.id,
        customerName: user?.name,
        customerEmail: user?.email,
        customerPhone: user?.phone,
        partName: formData.partName,
        vehicleModel: formData.vehicleModel,
        category: formData.category,
        condition: formData.condition,
        description: formData.description,
        referencePhoto: formData.referencePhoto,
        budgetMin: parseInt(formData.budgetMin),
        budgetMax: parseInt(formData.budgetMax),
        location: {
          state: location.state,
          district: location.district,
          area: location.area
        }
      };

      // Send to backend
      const response = await fetch('http://localhost:5001/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        toast.success(`🎯 Request broadcasted to ${result.notifiedShopkeepers} shopkeepers!`);

        // Reset form
        setFormData({
          partName: '',
          vehicleModel: '',
          category: 'Car Parts',
          condition: 'New',
          description: '',
          budgetMin: '',
          budgetMax: '',
          referencePhoto: null
        });
        setPhotoPreview(null);

        onClose();
      } else {
        toast.error(result.message || 'Failed to submit request');
      }
    } catch (error) {

      // More specific error messages
      if (error.message.includes('Failed to fetch')) {
        toast.error('Cannot connect to server. Please ensure the backend is running on port 5001.');
      } else if (error.message.includes('500')) {
        toast.error('Server error. Please check the backend logs.');
      } else if (error.message.includes('400')) {
        toast.error('Invalid request data. Please check all fields.');
      } else {
        toast.error(`Failed to submit request: ${error.message}`);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
                <Zap size={20} className="text-brand-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary">Request a Part</h2>
                <p className="text-xs text-text-secondary opacity-60">Broadcast to shopkeepers in your area</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full glass border border-border-primary/50 flex items-center justify-center hover:border-red-500/50 transition-all group"
            >
              <X size={16} className="text-text-secondary group-hover:text-red-500 transition-colors" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Part Name */}
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                Part Name *
              </label>
              <input
                type="text"
                value={formData.partName}
                onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                placeholder="e.g., Front Bumper, Headlight, Battery"
                className="w-full px-4 py-3 rounded-3xl glass border border-border-primary/50 text-text-primary placeholder:text-text-secondary/40 focus:border-brand-primary/50 focus:outline-none transition-all"
                required
              />
            </div>

            {/* Vehicle Model */}
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                Vehicle Model *
              </label>
              <input
                type="text"
                value={formData.vehicleModel}
                onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                placeholder="e.g., Toyota Innova 2018, Honda City 2020"
                className="w-full px-4 py-3 rounded-3xl glass border border-border-primary/50 text-text-primary placeholder:text-text-secondary/40 focus:border-brand-primary/50 focus:outline-none transition-all"
                required
              />
            </div>

            {/* Category & Condition */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-3xl glass border border-border-primary/50 text-text-primary focus:border-brand-primary/50 focus:outline-none transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                  Condition *
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full px-4 py-3 rounded-3xl glass border border-border-primary/50 text-text-primary focus:border-brand-primary/50 focus:outline-none transition-all"
                >
                  {conditions.map((cond) => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Any additional details about the part you need..."
                rows={3}
                className="w-full px-4 py-3 rounded-3xl glass border border-border-primary/50 text-text-primary placeholder:text-text-secondary/40 focus:border-brand-primary/50 focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Reference Photo Upload */}
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                Reference Photo (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="photo-upload"
                  className={`w-full px-4 py-6 rounded-3xl glass border-2 border-dashed border-border-primary/50 flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary/50 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {photoPreview ? (
                    <div className="relative w-full">
                      <img src={photoPreview} alt="Preview" className="w-full h-40 object-cover rounded-2xl" />
                      <div className="absolute top-2 right-2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                        Uploaded
                      </div>
                    </div>
                  ) : (
                    <>
                      <ImageIcon size={32} className="text-brand-primary mb-2" />
                      <p className="text-sm font-bold text-text-primary">
                        {uploading ? 'Uploading...' : 'Click to upload photo'}
                      </p>
                      <p className="text-xs text-text-secondary opacity-60 mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                Target Budget Range *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <input
                    type="number"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                    placeholder="Min"
                    className="w-full pl-10 pr-4 py-3 rounded-3xl glass border border-border-primary/50 text-text-primary placeholder:text-text-secondary/40 focus:border-brand-primary/50 focus:outline-none transition-all"
                    required
                  />
                </div>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <input
                    type="number"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                    placeholder="Max"
                    className="w-full pl-10 pr-4 py-3 rounded-3xl glass border border-border-primary/50 text-text-primary placeholder:text-text-secondary/40 focus:border-brand-primary/50 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location Display */}
            <div className="p-4 rounded-3xl bg-brand-primary/5 border border-brand-primary/20">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={14} className="text-brand-primary" />
                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Broadcasting to</span>
              </div>
              <p className="text-sm font-bold text-text-primary">
                {location.area ? `${location.area}, ` : ''}{location.district}, {location.state}
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-brand-primary to-purple-600 text-white font-bold text-sm uppercase tracking-widest rounded-3xl shadow-lg shadow-brand-primary/30 hover:shadow-brand-primary/50 transition-all glow-effect relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Zap size={18} />
                Submit Request
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RequestFormModal;
