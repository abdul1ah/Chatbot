import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, User, Mail, Phone } from 'lucide-react';
import { sendMessageToAI } from '../services/ai';
// 1. Import the configuration file
import configData from '../utils/config.json';

const ChatWindow = () => {
  // 2. Extract the configuration for the currently selected industry
  const activeIndustry = configData.industries[configData.selected];

  const [messages, setMessages] = useState([
    { id: 1, text: activeIndustry.welcome, sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages, isLoading, showForm]);

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Logic for capturing leads
    console.log("Lead Captured:", data); 
    
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      text: `Got it, ${data.name}! Our team specializing in ${configData.selected} has been notified. They will reach out to ${data.email} shortly.`, 
      sender: 'bot' 
    }]);
    setShowForm(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    // 3. Pass the selected industry to the AI service for context
    const aiResponse = await sendMessageToAI(inputText, configData.selected);
    setIsLoading(false);

    if (aiResponse === "FALLBACK_TRIGGER") {
      setShowForm(true);
    } else {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiResponse, sender: 'bot' }]);
    }
  };

  return (
    <div className="cb-fixed cb-bottom-24 cb-right-6 cb-w-96 cb-h-[500px] cb-bg-white cb-rounded-xl cb-shadow-2xl cb-flex cb-flex-col cb-overflow-hidden cb-z-50 cb-border cb-border-gray-200 cb-font-sans">
      
      {/* 4. Use dynamic color and Bot Name from JSON */}
      <div className={`${activeIndustry.color} cb-p-4 cb-text-white cb-font-bold cb-flex cb-justify-between cb-items-center`}>
        <span>{activeIndustry.botName || "Chat Support"}</span>
        <span className="cb-text-[10px] cb-bg-white/20 cb-px-2 cb-py-0.5 cb-rounded-full">
          {configData.selected}
        </span>
      </div>

      <div className="cb-flex-1 cb-p-4 cb-overflow-y-auto cb-bg-gray-50 cb-space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`cb-flex ${msg.sender === 'user' ? 'cb-justify-end' : 'cb-justify-start'}`}>
            <div className={`cb-max-w-[80%] cb-p-3 cb-rounded-lg cb-text-sm ${
              msg.sender === 'user' 
              ? `${activeIndustry.color} cb-text-white` 
              : 'cb-bg-white cb-border cb-text-gray-800'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {showForm && (
          <div className="cb-bg-blue-50 cb-border cb-border-blue-200 cb-p-4 cb-rounded-lg">
            <p className="cb-text-xs cb-font-bold cb-mb-3 cb-text-blue-800 uppercase">Escalate to Admin</p>
            <form onSubmit={handleLeadSubmit} className="cb-space-y-3">
              <input name="name" placeholder="Name" required className="cb-w-full cb-p-2 cb-border cb-rounded cb-text-sm" />
              <input name="email" type="email" placeholder="Email" required className="cb-w-full cb-p-2 cb-border cb-rounded cb-text-sm" />
              <input name="phone" type="tel" placeholder="Phone" required className="cb-w-full cb-p-2 cb-border cb-rounded cb-text-sm" />
              <button type="submit" className={`cb-w-full ${activeIndustry.color} cb-text-white cb-py-2 cb-rounded cb-text-sm cb-font-bold hover:cb-opacity-90`}>
                Submit Request
              </button>
            </form>
          </div>
        )}
        
        {isLoading && <Loader2 className={`cb-animate-spin cb-mx-auto ${activeIndustry.color.replace('bg-', 'text-')}`} size={24} />}
        <div ref={messagesEndRef} />
      </div>

      {!showForm && (
        <form onSubmit={handleSend} className="cb-p-4 cb-bg-white cb-border-t cb-flex cb-gap-2">
          <input 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)} 
            placeholder="Type 'talk to admin'..." 
            className="cb-flex-1 cb-p-2 cb-border cb-rounded cb-text-sm focus:cb-outline-none focus:cb-border-blue-500" 
          />
          <button type="submit" className={`${activeIndustry.color} cb-text-white cb-p-2 cb-rounded hover:cb-opacity-90`}>
            <Send size={18} />
          </button>
        </form>
      )}
    </div>
  );
};

export default ChatWindow;