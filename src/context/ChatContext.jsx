import React, { createContext, useContext, useState, useEffect } from 'react';
import configData from '../utils/config.json';
import { supabase } from '../utils/supabaseClient';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  
  const getInitialIndustry = () => {

    const params = new URLSearchParams(window.location.search);
    const urlIndustry = params.get('industry');


    if (urlIndustry && configData.industries[urlIndustry]) {
      console.log(`Switched to ${urlIndustry} mode via URL`);
      return configData.industries[urlIndustry];
    }
    

    return configData.industries[configData.selected];
  };

  const industry = getInitialIndustry(); 


  // State
  const [isOpen, setIsOpen] = useState(false);
  
  
  const [messages, setMessages] = useState([
    { id: 1, text: industry.welcome, sender: 'bot', type: 'text' }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  

  const [quickReplies, setQuickReplies] = useState(industry.quickReplies);

  const logMessage = async (text, sender) => {
    try {
      await supabase.from('chat_logs').insert([
        { 
          session_id: 'session-' + Date.now(), 
          industry: industry.botName, // Log which bot was used
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
    logMessage(text, sender); 
  };

  return (
    <ChatContext.Provider value={{ 
      industry, 
      isOpen, setIsOpen, 
      messages, setMessages, addMessage,
      isTyping, setIsTyping,
      quickReplies, setQuickReplies 
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);