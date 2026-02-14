import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, User, Mail, Phone } from 'lucide-react';
import { sendMessageToAI } from '../services/ai';
import { supabase } from '../utils/supabaseClient'; // Make sure this is imported
import configData from '../utils/config.json';

const ChatWindow = () => {
  const activeIndustry = configData.industries[configData.selected];
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showProactive, setShowProactive] = useState(false);
  const [messages, setMessages] = useState([{ id: 1, text: activeIndustry.welcome, sender: 'bot' }]);
  const [inputText, setInputText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => { if (!isOpen) setShowProactive(true); }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  // FIX: Proper Lead Submission to Supabase
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const { error } = await supabase
        .from('leads')
        .insert([{ 
          name: data.name, 
          email: data.email, 
          phone: data.phone, 
          industry: configData.selected 
        }]);

      if (error) throw error;

      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: `Got it, ${data.name}! Our experts have been notified. They'll reach out to you at ${data.email} soon.`, 
        sender: 'bot' 
      }]);
      setShowForm(false);
    } catch (err) {
      console.error("Save Error:", err.message);
      alert("Error saving lead. Please try again.");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    const aiResponse = await sendMessageToAI(inputText, configData.selected);
    setIsTyping(false);

    if (aiResponse.includes("FALLBACK_TRIGGER")) {
      setShowForm(true);
    } else {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiResponse, sender: 'bot' }]);
    }
  };

  return (
    <div className="cb-fixed cb-bottom-6 cb-right-6 cb-z-50 cb-font-sans">
      
      {/* Proactive Greeting */}
      {showProactive && !isOpen && (
        <div className="cb-absolute cb-bottom-20 cb-right-0 cb-w-48 cb-p-3 cb-bg-slate-900 cb-text-white cb-rounded-2xl cb-shadow-2xl cb-text-xs cb-animate-bounce cb-border cb-border-slate-700">
          <button onClick={() => setShowProactive(false)} className="cb-absolute cb-top-1 cb-right-1">
            <X size={12} className="cb-text-slate-400 hover:cb-text-white"/>
          </button>
          {activeIndustry.welcome}
        </div>
      )}

      {/* Launcher Button */}
      <button 
        onClick={() => { setIsOpen(!isOpen); setShowProactive(false); }}
        className={`cb-w-14 cb-h-14 cb-rounded-full cb-flex cb-items-center cb-justify-center cb-shadow-2xl cb-transition-transform hover:cb-scale-110 ${activeIndustry.color}`}
      >
        {isOpen ? <X color="white" /> : <Sparkles color="white" />}
      </button>

      {/* Main Glassmorphic Window */}
      {isOpen && (
        <div className="cb-absolute cb-bottom-20 cb-right-0 cb-w-96 cb-h-[550px] cb-bg-white/90 cb-backdrop-blur-xl cb-rounded-3xl cb-shadow-2xl cb-border cb-border-white/40 cb-flex cb-flex-col cb-overflow-hidden">
          
          <div className={`${activeIndustry.color} cb-p-5 cb-text-white cb-font-bold cb-flex cb-justify-between cb-items-center`}>
             <div className="cb-flex cb-items-center cb-gap-2">
                <div className="cb-w-2 cb-h-2 cb-bg-green-400 cb-rounded-full cb-animate-pulse" />
                <span>{activeIndustry.botName}</span>
             </div>
             <span className="cb-text-[10px] cb-bg-white/20 cb-px-2 cb-py-0.5 cb-rounded-full">{configData.selected}</span>
          </div>

          <div className="cb-flex-1 cb-p-4 cb-overflow-y-auto cb-space-y-4 cb-bg-gray-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`cb-flex cb-w-full ${msg.sender === 'user' ? 'cb-justify-end' : 'cb-justify-start'}`}>
                <div className={`cb-max-w-[85%] cb-p-3 cb-rounded-2xl cb-text-sm cb-shadow-sm cb-leading-relaxed ${
                  msg.sender === 'user' ? `${activeIndustry.color} cb-text-white cb-rounded-tr-none cb-font-medium` : 'cb-bg-white cb-text-slate-900 cb-rounded-tl-none cb-border cb-border-gray-200'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="cb-flex cb-gap-1 cb-p-3 cb-bg-white/50 cb-w-fit cb-rounded-2xl">
                <div className="cb-w-1.5 cb-h-1.5 cb-bg-gray-400 cb-rounded-full cb-animate-bounce" />
                <div className="cb-w-1.5 cb-h-1.5 cb-bg-gray-400 cb-rounded-full cb-animate-bounce [animation-delay:0.2s]" />
                <div className="cb-w-1.5 cb-h-1.5 cb-bg-gray-400 cb-rounded-full cb-animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {!showForm ? (
            <form onSubmit={handleSend} className="cb-p-4 cb-bg-white/60 cb-backdrop-blur-md cb-border-t cb-flex cb-gap-2">
              <input 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)} 
                placeholder="Type a message..." 
                className="cb-flex-1 cb-p-3 cb-bg-white cb-border cb-border-gray-300 cb-rounded-2xl cb-text-sm cb-text-slate-900 cb-placeholder-gray-500 focus:cb-outline-none focus:cb-ring-2 focus:cb-ring-blue-500/50"
              />
              <button type="submit" className={`${activeIndustry.color} cb-text-white cb-p-3 cb-rounded-2xl cb-shadow-lg`}><Send size={18}/></button>
            </form>
          ) : (
            <div className="cb-p-4 cb-bg-white cb-border-t cb-animate-in cb-slide-in-from-bottom">
              <p className="cb-text-xs cb-font-bold cb-mb-3 cb-text-blue-800 cb-uppercase cb-tracking-wider">Human Support Needed</p>
              <form onSubmit={handleLeadSubmit} className="cb-space-y-3">
                 <input name="name" placeholder="Full Name" className="cb-w-full cb-p-2 cb-border cb-rounded-lg cb-text-sm cb-text-slate-900" required />
                 <input name="email" type="email" placeholder="Email Address" className="cb-w-full cb-p-2 cb-border cb-rounded-lg cb-text-sm cb-text-slate-900" required />
                 <input name="phone" type="tel" placeholder="Phone Number" className="cb-w-full cb-p-2 cb-border cb-rounded-lg cb-text-sm cb-text-slate-900" required />
                 <button className={`${activeIndustry.color} cb-w-full cb-text-white cb-py-2 cb-rounded-lg cb-text-sm cb-font-bold hover:cb-opacity-90`}>Submit Request</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWindow;