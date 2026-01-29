import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, ChevronDown, Search, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { indianLocations } from '../data/indianLocations';

const LocationModal = ({ isOpen, onClose, onSelect }) => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [isManual, setIsManual] = useState(false);

  // Reset district when state changes
  useEffect(() => {
    if (!isManual) {
      setSelectedDistrict('');
    }
  }, [selectedState, isManual]);

  const handleUseCurrent = () => {
    const toastId = toast.loading("Locating...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => {
        // Simulated success for demo
        setTimeout(() => {
          const detected = { state: 'Delhi', district: 'New Delhi', area: 'Connaught Place' };
          onSelect(detected);
          toast.success("Location Detected", { id: toastId });
          onClose();
        }, 1500);
      }, (err) => {
        toast.error("Permission Denied", { id: toastId });
      });
    } else {
      toast.error("Geolocation not supported", { id: toastId });
    }
  };

  const handleConfirm = () => {
    if (isManual) {
      if (manualLocation.trim()) {
        onSelect({ state: 'Custom', district: 'Custom', area: manualLocation });
        onClose();
      }
      return;
    }

    if (selectedState && selectedDistrict) {
      onSelect({
        state: selectedState,
        district: selectedDistrict,
        area: selectedDistrict === 'All' ? selectedState : selectedDistrict
      });
      onClose();
    }
  };

  const filteredStates = useMemo(() => {
    if (!searchQuery) return indianLocations;
    return indianLocations.filter(loc =>
      loc.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.districts.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const currentDistricts = useMemo(() => {
    const stateData = indianLocations.find(s => s.state === selectedState);
    return stateData ? stateData.districts : [];
  }, [selectedState]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[150] p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md glass-card p-0 overflow-hidden shadow-2xl bg-bg-secondary/90 border border-white/10"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h3 className="font-bold text-text-primary text-xl tracking-tight flex items-center gap-2">
                <MapPin size={20} className="text-brand-primary" />
                Select Location
              </h3>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-text-secondary transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Search Bar for Quick Find */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-brand-primary transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search State or District..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-bg-primary/50 border border-white/10 rounded-xl outline-none text-sm font-semibold text-text-primary focus:border-brand-primary/50 transition-all glow-effect"
                />
              </div>

              <button
                onClick={handleUseCurrent}
                className="w-full py-4 bg-brand-primary/10 border border-brand-primary/50 text-brand-primary rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-primary/20 transition-all glow-effect"
              >
                <Navigation size={18} /> Use Current Location
              </button>

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] font-black uppercase text-text-secondary opacity-50 tracking-widest">Or Select Manually</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {!isManual ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">State</label>
                    <div className="relative">
                      <select
                        value={selectedState}
                        onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict(''); }}
                        className="w-full px-4 py-3 bg-bg-primary/50 border border-white/10 rounded-xl outline-none appearance-none text-sm font-semibold text-text-primary focus:border-brand-primary/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all"
                      >
                        <option value="">Select State</option>
                        {filteredStates.map(s => <option key={s.state} value={s.state}>{s.state}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={16} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedState && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">District / Area</label>
                        <div className="relative">
                          <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="w-full px-4 py-3 bg-bg-primary/50 border border-white/10 rounded-xl outline-none appearance-none text-sm font-semibold text-text-primary focus:border-brand-primary/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all"
                          >
                            <option value="">Select District</option>
                            {currentDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={16} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest pl-1">Enter Your Location</label>
                  <input
                    type="text"
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    placeholder="Village, Town, or Area Name"
                    className="w-full px-4 py-3 bg-bg-primary/50 border border-white/10 rounded-xl outline-none text-sm font-semibold text-text-primary focus:border-brand-primary/50 transition-all glow-effect"
                  />
                </div>
              )}

              {/* Manual Entry Toggle */}
              <div className="flex justify-center">
                <button
                  onClick={() => setIsManual(!isManual)}
                  className="text-xs text-brand-primary font-bold hover:underline"
                >
                  {isManual ? "Switch to List Selection" : "Can't find your location? Type manually"}
                </button>
              </div>

              <button
                disabled={(!isManual && !selectedDistrict) || (isManual && !manualLocation)}
                onClick={handleConfirm}
                className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Confirm Location
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Add useEffect import manually since I might have missed it in the component body
import { useEffect } from 'react';

export default LocationModal;
