import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { MessageSquare, Search, Clock, ChevronRight } from 'lucide-react';

const ChatList = () => {
  const navigate = useNavigate();
  const { conversations, setActiveConversationId, markAsRead } = useChat();

  const handleOpenChat = (id) => {
    setActiveConversationId(id);
    markAsRead(id);
    navigate(`/chat/${id}`);
  };

  return (
    <div className="pt-24 pb-32 px-4 md:px-8 max-w-4xl mx-auto min-h-screen">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-text-primary tracking-tight mb-2">
          Messages
        </h1>
        <p className="text-text-secondary text-sm font-medium opacity-60">Connect with shops</p>
      </header>

      {/* Search */}
      <div className="relative mb-8 group glow-effect">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-brand-primary transition-colors" size={18} />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-14 pr-6 py-4 bg-bg-secondary rounded-2xl border border-border-primary focus:border-brand-primary/30 outline-none text-text-primary font-bold shadow-sm transition-all"
        />
      </div>

      <div className="space-y-3">
        {conversations.map((conv, idx) => (
          <motion.div
            key={conv.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOpenChat(conv.id)}
            className="glass-card p-5 group flex items-center gap-5 relative overflow-hidden glow-effect cursor-pointer"
          >
            {/* Status */}
            {conv.online && (
              <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-emerald-500 rounded-r-full shadow-lg shadow-emerald-500/20" />
            )}

            {/* Avatar */}
            <div className="w-14 h-14 bg-bg-primary rounded-2xl flex items-center justify-center relative flex-shrink-0 border border-border-primary/50 overflow-hidden shadow-inner">
              <img
                src={conv.product.image}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                alt={conv.product.name}
              />
              {conv.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-brand-primary/10 z-10">
                  {conv.unreadCount}
                </span>
              )}
            </div>

            {/* Body */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-base text-text-primary tracking-tight truncate">{conv.participantName}</h3>
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1 opacity-50">
                  <Clock size={12} /> {conv.time}
                </span>
              </div>
              <p className={`text-sm tracking-tight truncate pr-4 ${conv.unreadCount > 0 ? 'font-bold text-text-primary' : 'font-medium text-text-secondary opacity-60'}`}>
                {typeof conv.lastMessage === 'object' ? `${conv.lastMessage.lat.toFixed(1)}, ${conv.lastMessage.lng.toFixed(1)}` : conv.lastMessage}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="px-2 py-0.5 bg-brand-primary/5 rounded-md border border-brand-primary/10">
                  <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest">{conv.product.name}</span>
                </div>
              </div>
            </div>

            <ChevronRight size={18} className="text-text-secondary opacity-20 group-hover:text-brand-primary group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
          </motion.div>
        ))}

        {conversations.length === 0 && (
          <div className="text-center py-24 opacity-20">
            <MessageSquare size={64} className="mx-auto mb-4" strokeWidth={1} />
            <p className="font-bold text-lg">No messages</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
