import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  MapPin,
  ShieldCheck,
  Camera,
  Save,
  LogOut,
  ChevronRight,
  Settings,
  Bell,
  HardDrive,
  Phone,
  Eye,
  EyeOff,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, logout, updateProfile } = useAuth();
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: (user?.location && typeof user.location === 'object') ? `${user.location.lat}, ${user.location.lng}` : (user?.location || 'New Delhi, India'),
    bio: user?.bio || 'Automotive enthusiast and professional dealer.',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size too large (Max 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          updateProfile({ avatar: reader.result });
          toast.success("Profile photo updated");
        } catch (error) {
          toast.error("Failed to process image");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      toast.error("Mobile number must be 10 digits");
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Invalid email format");
      return;
    }

    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (formData.newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
    }

    try {
      const { newPassword, confirmPassword, ...profileData } = formData;
      const updates = formData.newPassword ? { ...profileData, password: newPassword } : profileData;

      updateProfile(updates);
      setIsEditing(false);
      setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
      toast.success("Profile saved");
    } catch (err) {
      toast.error("Failed to save profile");
    }
  };

  return (
    <div className="pt-24 pb-32 px-4 md:px-8 max-w-4xl mx-auto min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 p-2 text-text-secondary hover:text-brand-primary transition-all flex items-center gap-2 text-sm font-semibold btn-press"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Profile Header */}
      <div className="glass-card p-6 md:p-10 mb-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-28 h-28 md:w-36 md:h-36 bg-bg-primary rounded-full flex items-center justify-center text-brand-primary/20 border border-border-primary/50 overflow-hidden shadow-inner">
              {user?.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <User size={48} />
              )}
            </div>
            <label className="absolute bottom-1 right-1 p-2.5 bg-brand-primary text-white rounded-full shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all border-4 border-white/50">
              <Camera size={16} />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
              {isEditing ? (
                <input
                  className="bg-bg-primary/50 border border-border-primary/50 rounded-xl px-4 py-2 text-2xl font-bold text-text-primary outline-none focus:border-brand-primary/30"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              ) : (
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">{user?.name}</h1>
              )}
              <div className="flex items-center justify-center md:justify-start gap-1.5 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20">
                <ShieldCheck size={12} fill="currentColor" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{user?.role || 'Guest'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {isEditing ? (
                <>
                  <div className="floating-label-group">
                    <input
                      className="w-full bg-bg-primary/50 border border-border-primary/50 rounded-xl px-4 py-3 text-sm font-semibold outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email"
                    />
                    <label>Email</label>
                  </div>
                  <div className="floating-label-group">
                    <input
                      className="w-full bg-bg-primary/50 border border-border-primary/50 rounded-xl px-4 py-3 text-sm font-semibold outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Phone"
                    />
                    <label>Phone</label>
                  </div>
                </>
              ) : (
                <>
                  <p className="flex items-center justify-center md:justify-start gap-2 text-text-secondary text-sm font-medium">
                    <Mail size={14} className="text-brand-primary opacity-60" /> {user?.email}
                  </p>
                  {user?.phone && (
                    <p className="flex items-center justify-center md:justify-start gap-2 text-text-secondary text-sm font-medium">
                      <Phone size={14} className="text-brand-primary opacity-60" /> {user?.phone}
                    </p>
                  )}
                  <p className="flex items-center justify-center md:justify-start gap-2 text-text-secondary text-sm font-medium">
                    <MapPin size={14} className="text-brand-primary opacity-60" /> {formData.location}
                  </p>
                </>
              )}
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <button onClick={handleSave} className="px-8 py-3 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 btn-press">
                  Save Changes <Save size={16} />
                </button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-8 py-3 glass text-text-primary rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-bg-primary hover:text-white transition-all btn-press">
                  Edit Profile <Settings size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
        <ProfileCard icon={<Bell size={20} />} title="Notifications" subtitle="Bids & message alerts" color="text-indigo-600" />
        <ProfileCard icon={<HardDrive size={20} />} title="History" subtitle="View your activity" color="text-emerald-500" />

        <div onClick={() => { logout(); navigate('/login'); toast.success("Logged out"); }} className="md:col-span-2 glass border border-border-primary/50 p-6 rounded-3xl flex items-center justify-between cursor-pointer group transition-all btn-press">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center">
              <LogOut size={20} />
            </div>
            <div>
              <h3 className="font-bold text-text-primary text-lg">Log Out</h3>
              <p className="text-text-secondary text-xs opacity-60">Disconnect from session</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-text-secondary group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
};

const ProfileCard = ({ icon, title, subtitle, color }) => (
  <div className="glass-card p-6 hover:shadow-md transition-all cursor-pointer group btn-press">
    <div className={`w-12 h-12 bg-bg-primary/50 ${color} rounded-xl flex items-center justify-center mb-4 border border-border-primary/20`}>
      {icon}
    </div>
    <h3 className="font-bold text-text-primary text-lg mb-0.5">{title}</h3>
    <p className="text-text-secondary text-xs font-medium opacity-60">{subtitle}</p>
  </div>
);

export default ProfilePage;

