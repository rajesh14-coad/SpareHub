import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import {
  Send,
  ArrowLeft,
  MoreVertical,
  Phone,
  Trash2,
  UserX,
  Store,
  MapPin,
  Camera,
  Handshake,
  CheckCheck,
  Check,
  Paperclip,
  Smile,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const ChatWindow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { conversations, sendMessage, clearChat, blockUser } = useChat();
  const { coords } = useAuth();
  const messagesEndRef = useRef(null);

  const [inputMessage, setInputMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const conversation = conversations.find(c => c.id === id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  if (!conversation) return <div className="pt-36 text-center text-text-secondary font-bold">No chat.</div>;

  const handleSend = () => {
    if (inputMessage.trim()) {
      try {
        sendMessage(id, inputMessage);
        setInputMessage('');
      } catch (err) {
        toast.error("Error");
      }
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'read') return <CheckCheck size={14} className="text-brand-primary" />;
    if (status === 'delivered') return <CheckCheck size={14} className="opacity-40" />;
    return <Check size={14} className="opacity-40" />;
  };

  return (
    <div className="flex flex-col h-screen pt-[72px] md:pt-24 bg-bg-primary overflow-hidden">
      <header className="flex items-center justify-between px-4 md:px-8 py-4 glass border-b border-border-primary/50 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/chats')}
            className="p-2 hover:bg-bg-primary/50 rounded-full transition-all text-text-secondary"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <div className="relative cursor-pointer" onClick={() => navigate(`/shop/profile/${conversation.participantId}`)}>
            <div className="w-10 h-10 bg-bg-primary rounded-full flex items-center justify-center border border-border-primary/50 overflow-hidden">
              <img src={conversation.product.image} className="w-full h-full object-cover" alt="Product" />
            </div>
            {conversation.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-sm text-text-primary tracking-tight leading-none">{conversation.participantName}</h3>
            <span className="text-[10px] font-semibold text-emerald-500 mt-1 flex items-center gap-1 opacity-70">
              {conversation.online ? 'Online' : 'Active'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 relative">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => toast("N/A")} className="p-2 hover:bg-bg-primary/50 rounded-full text-text-secondary"><Phone size={18} /></motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-bg-primary/50 rounded-full text-text-secondary"
          >
            <MoreVertical size={18} />
          </motion.button>

          <AnimatePresence>
            {showMenu && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMenu(false)} className="fixed inset-0 z-40" />
                <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }} className="absolute right-0 top-12 w-52 glass border border-border-primary/50 rounded-2xl shadow-xl z-50 p-1">
                  <MenuButton onClick={() => { navigate(`/shop/profile/${conversation.participantId}`); setShowMenu(false); }} icon={<Store size={16} className="text-brand-primary" />} text="View Shop" />
                  <MenuButton onClick={() => { clearChat(id); setShowMenu(false); toast.success("Cleared"); }} icon={<Trash2 size={16} />} text="Clear Chat" color="text-red-500" />
                  <MenuButton onClick={() => { blockUser(id); setShowMenu(false); toast.error("Blocked"); }} icon={<UserX size={16} />} text="Block User" color="text-red-500" />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Item Reference */}
      <div className="bg-brand-primary/5 px-6 py-2 flex items-center justify-between border-b border-border-primary/20">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">{conversation.product.name}</span>
          <span className="text-[10px] font-bold text-text-secondary opacity-40">₹{conversation.product.price.toLocaleString()}</span>
        </div>
        <button onClick={() => navigate(`/customer/product/${conversation.product.id}`)} className="text-[9px] font-bold text-brand-primary uppercase tracking-widest hover:underline">View</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 no-scrollbar bg-bg-primary">
        {conversation.messages.map((msg, idx) => {
          const isOwn = msg.sender === 'customer';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm relative ${isOwn
                ? 'bg-brand-primary text-white rounded-tr-sm'
                : 'bg-bg-secondary glass text-text-primary rounded-tl-sm'
                }`}>
                {msg.sender === 'system' ? (
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider opacity-40 py-1">
                    <ShieldCheck size={12} /> {msg.text}
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-semibold leading-relaxed">
                      {typeof msg.text === 'object' ? `${msg.text.lat.toFixed(2)}, ${msg.text.lng.toFixed(2)}` : msg.text}
                    </p>
                    <div className={`text-[9px] font-bold uppercase mt-2 flex items-center gap-1.5 ${isOwn ? 'justify-end text-white/60' : 'text-text-secondary opacity-40'}`}>
                      {msg.time} {isOwn && getStatusIcon(msg.status)}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Actions */}
      <div className="px-4 md:px-8 py-2.5 flex gap-2 overflow-x-auto no-scrollbar bg-bg-secondary/50 border-t border-border-primary/20">
        <QuickAction
          onClick={() => {
            if (coords) {
              sendMessage(id, coords);
              toast.success("Shared");
            } else {
              toast.error("N/A");
            }
          }}
          icon={<MapPin size={12} />}
          text="Location"
        />
        <QuickAction onClick={() => toast("Sent")} icon={<Camera size={12} />} text="Photos" />
        <QuickAction onClick={() => toast("Confirmed")} icon={<Handshake size={12} />} text="Order" primary />
      </div>

      <footer className="p-4 md:px-8 md:pb-8 md:pt-4 glass border-t border-border-primary/30 z-20">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.95 }} className="p-3 hover:bg-bg-primary rounded-full text-brand-primary transition-all bg-bg-primary/50 border border-border-primary/30"><Paperclip size={20} /></motion.button>
          <div className="flex-1 relative group bg-bg-primary rounded-2xl border border-border-primary/50 shadow-sm glow-effect">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Message..."
              className="w-full pl-5 pr-12 py-3.5 bg-transparent outline-none text-text-primary font-semibold text-sm"
            />
            <Smile className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-brand-primary cursor-pointer transition-colors" size={20} />
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!inputMessage.trim()}
            className="p-3.5 bg-brand-primary text-white rounded-full shadow-lg shadow-brand-primary/20 disabled:opacity-50 glow-effect"
          >
            <Send size={20} />
          </motion.button>
        </div>
      </footer>
    </div>
  );
};

const MenuButton = ({ onClick, icon, text, color = "text-text-primary" }) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 hover:bg-bg-primary rounded-xl text-left text-[10px] font-bold uppercase tracking-wider transition-all ${color}`}
  >
    {icon} {text}
  </motion.button>
);

const QuickAction = ({ icon, text, primary, onClick }) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap text-[9px] font-bold uppercase tracking-wider transition-all glow-effect ${primary
      ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
      : 'glass border-border-primary/50 text-text-secondary hover:text-text-primary'
      }`}
  >
    {icon} {text}
  </motion.button>
);

export default ChatWindow;
