import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, ShieldAlert, ScanLine } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ScannerModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    let scanner = null;

    if (isOpen) {
      // Small timeout to ensure container is rendered
      const timeoutId = setTimeout(() => {
        try {
          scanner = new Html5QrcodeScanner(
            "qr-reader",
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0,
              showTorchButtonIfSupported: true,
            },
            /* verbose= */ false
          );

          scanner.render(onScanSuccess, onScanFailure);
        } catch (err) {
          console.error("Scanner init error:", err);
          setError("Could not initialize camera");
        }
      }, 300);

      return () => {
        clearTimeout(timeoutId);
        if (scanner) {
          scanner.clear().catch(error => {
            console.error("Failed to clear scanner", error);
          });
        }
      };
    }
  }, [isOpen]);

  function onScanSuccess(decodedText, decodedResult) {
    // Expected format: https://.../shop/shopID
    try {
      if (decodedText.includes('/shop/')) {
        const parts = decodedText.split('/shop/');
        const shopId = parts[parts.length - 1];
        if (shopId) {
          toast.success("Shop Found! Redirecting...");
          onClose();
          navigate(`/shop/${shopId}`);
        }
      } else {
        toast.error("Invalid PurzaSetu QR Code");
      }
    } catch (err) {
      toast.error("Error processing QR");
    }
  }

  function onScanFailure(error) {
    // Handle scan failure, usually better to ignore it as it happens constantly
    // console.warn(`Code scan error = ${error}`);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg glass-card relative z-[201] p-8 text-center overflow-hidden glow-effect"
          >
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-border-primary/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                  <ScanLine size={20} />
                </div>
                <h2 className="text-xl font-black text-text-primary italic uppercase tracking-tight">QR Scanner</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-bg-primary rounded-lg text-text-secondary transition-all">
                <X size={20} />
              </button>
            </div>

            {error ? (
              <div className="py-20 flex flex-col items-center">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldAlert size={32} />
                </div>
                <p className="text-sm font-bold text-text-primary mb-2">{error}</p>
                <p className="text-xs font-medium text-text-secondary opacity-60">Please ensure camera permissions are granted.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div
                  id="qr-reader"
                  className="rounded-[2rem] overflow-hidden border-2 border-brand-primary/20 bg-black/20 aspect-square"
                />

                <div className="flex flex-col items-center gap-2">
                  <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">PurzaSetu Digital Scanner</p>
                  <p className="text-xs font-medium text-text-secondary opacity-60">Point your camera at a PurzaSetu shop QR code</p>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="mt-8 w-full py-4 glass text-text-secondary rounded-2xl font-black italic text-sm hover:bg-bg-primary transition-all"
            >
              CANCEL
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ScannerModal;
