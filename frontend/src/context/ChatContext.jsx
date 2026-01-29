import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);

  const [activeConversationId, setActiveConversationId] = useState(null);

  const sendMessage = (conversationId, text) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessage: text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          messages: [...conv.messages, {
            id: Date.now(),
            sender: 'customer',
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
          }]
        };
      }
      return conv;
    }));
  };

  const clearChat = (conversationId) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, messages: [], lastMessage: 'Chat cleared' };
      }
      return conv;
    }));
  };

  const blockUser = (conversationId) => {
    // Mock blocking logic - implement actual blocking in production
  };

  const handleRequest = (conversationId, requestId, status) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId && conv.pendingRequest?.id === requestId) {
        return {
          ...conv,
          pendingRequest: { ...conv.pendingRequest, status },
          messages: [...conv.messages, {
            id: Date.now(),
            sender: 'system',
            text: `Request ${status.toUpperCase()}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]
        };
      }
      return conv;
    }));
  };

  const totalUnreadCount = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);

  const markAsRead = (conversationId) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, unreadCount: 0 };
      }
      return conv;
    }));
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      sendMessage,
      activeConversationId,
      setActiveConversationId,
      totalUnreadCount,
      markAsRead,
      handleRequest,
      clearChat,
      blockUser
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
