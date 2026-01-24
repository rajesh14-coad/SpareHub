import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, CheckCircle, Calendar, Package, User, MapPin } from 'lucide-react';

const Invoice = ({ order, onClose }) => {
  const handleDownload = () => {
    // In a real app, this would generate a PDF
    const printContent = document.getElementById('invoice-content');
    const printWindow = window.open('', '', 'height=800,width=800');
    printWindow.document.write('<html><head><title>Invoice</title>');
    printWindow.document.write('<style>body{font-family:Arial,sans-serif;padding:40px;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[150] p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl glass-card relative p-8 max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-bg-primary rounded-lg text-text-secondary transition-all"
        >
          <X size={20} />
        </button>

        <div id="invoice-content" className="space-y-8">
          {/* Header */}
          <div className="text-center border-b border-border-primary/30 pb-6">
            <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-primary/30">
              <Package size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-text-primary tracking-tight mb-1">SpareHub</h1>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest opacity-60">Digital Invoice</p>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2 opacity-50">Invoice Number</p>
              <p className="text-lg font-bold text-brand-primary">{order.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2 opacity-50">Date</p>
              <p className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Calendar size={14} className="text-brand-primary" />
                {new Date(order.completedAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Shop & Customer Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="glass p-4 rounded-xl border border-border-primary/30">
              <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-3">From</p>
              <p className="text-sm font-bold text-text-primary mb-1">{order.shopName}</p>
              <p className="text-xs font-medium text-text-secondary opacity-70 flex items-center gap-1">
                <MapPin size={12} /> New Delhi, India
              </p>
            </div>
            <div className="glass p-4 rounded-xl border border-border-primary/30">
              <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-3">To</p>
              <p className="text-sm font-bold text-text-primary mb-1 flex items-center gap-2">
                <User size={14} /> {order.customerName}
              </p>
              <p className="text-xs font-medium text-text-secondary opacity-70">Customer</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-border-primary/30 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-bg-primary/50">
                <tr className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                  <th className="text-left p-4">Item</th>
                  <th className="text-right p-4">Qty</th>
                  <th className="text-right p-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border-primary/20">
                  <td className="p-4">
                    <p className="font-bold text-text-primary text-sm">{order.productName}</p>
                    <p className="text-xs text-text-secondary opacity-60 mt-1">Auto Spare Part</p>
                  </td>
                  <td className="p-4 text-right font-bold text-text-primary">1</td>
                  <td className="p-4 text-right font-bold text-text-primary">₹{order.amount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-text-secondary">Subtotal</span>
                <span className="font-bold text-text-primary">₹{order.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-text-secondary">Tax (0%)</span>
                <span className="font-bold text-text-primary">₹0</span>
              </div>
              <div className="pt-3 border-t border-border-primary/30 flex justify-between">
                <span className="font-bold text-text-primary uppercase text-xs tracking-wider">Total</span>
                <span className="font-bold text-2xl text-brand-primary">₹{order.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Paid Stamp */}
          <div className="flex items-center justify-center gap-3 p-6 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl">
            <CheckCircle size={24} className="text-emerald-500" />
            <span className="text-lg font-bold text-emerald-500 uppercase tracking-wider">Paid</span>
          </div>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-border-primary/20">
            <p className="text-xs font-medium text-text-secondary opacity-60">
              Thank you for choosing SpareHub!
            </p>
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-40 mt-2">
              Booking Code: {order.bookingCode}
            </p>
          </div>
        </div>

        {/* Download Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleDownload}
          className="w-full mt-6 py-4 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 glow-effect"
        >
          <Download size={20} /> Download PDF
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Invoice;
