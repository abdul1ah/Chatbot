import React, { createContext, useContext, useState, useEffect } from 'react';
import configData from '../utils/config.json';
import { supabase } from '../utils/supabaseClient';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const industry = configData.industries[configData.selected];
  
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: industry.welcome, sender: 'bot', type: 'text' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Analytics: Log Message to Supabase
  const logMessage = async (text, sender) => {
    try {
      await supabase.from('chat_logs').insert([
        { 
          session_id: 'session-' + Date.now(), // Simple session ID
          industry: configData.selected,
          sender: sender,
          message: text 
        }
      ]);
    } catch (error) {
      console.error("Analytics Error:", error);
    }
  };

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
    logMessage(text, sender); // Trigger Analytics
  };

  return (
    <ChatContext.Provider value={{ 
      industry, 
      isOpen, setIsOpen, 
      messages, setMessages, addMessage,
      isTyping, setIsTyping 
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);