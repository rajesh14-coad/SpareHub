import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([
    {
      id: 'conv1',
      participantId: 'shop1',
      participantName: 'AutoParts Syndicate',
      participantRole: 'shop',
      lastMessage: 'Is the headlight still available?',
      time: '10:45 AM',
      unreadCount: 2,
      online: true,
      product: {
        id: 1,
        name: 'Toyota Innova Headlight',
        price: 4500,
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop'
      },
      messages: [
        { id: 1, sender: 'customer', text: 'Hi, I saw your listing for the Innova headlight.', time: '10:40 AM', status: 'read' },
        { id: 2, sender: 'shop', text: 'Hello! Yes, it is still in stock. It is a genuine OEM part.', time: '10:42 AM', status: 'read' },
        { id: 3, sender: 'customer', text: 'Great, can you offer any discount?', time: '10:43 AM', status: 'read' },
        { id: 4, sender: 'shop', text: 'Since you are nearby, I can give it for ₹4,200.', time: '10:45 AM', status: 'delivered' },
      ],
      pendingRequest: {
        id: 'req1',
        status: 'pending',
        type: 'quote',
        amount: 4200
      }
    },
    {
      id: 'conv2',
      participantId: 'user123',
      participantName: 'Rahul Sharma',
      participantRole: 'customer',
      lastMessage: 'Thanks, I will visit tomorrow.',
      time: 'Yesterday',
      unreadCount: 0,
      online: false,
      product: {
        id: 2,
        name: 'Honda City Bumper',
        price: 2800,
        image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop'
      },
      messages: [
        { id: 1, sender: 'customer', text: 'Interested in the bumper.', time: '5:00 PM', status: 'read' },
        { id: 2, sender: 'shop', text: 'Sure, when do you want to pick it up?', time: '5:10 PM', status: 'read' },
        { id: 3, sender: 'customer', text: 'Thanks, I will visit tomorrow.', time: '5:15 PM', status: 'read' },
      ]
    }
  ]);

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
    // Mock blocking logic
    console.log(`User in conversation ${conversationId} blocked`);
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
