import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, User, Bot, Phone, ChevronDown } from 'lucide-react';
import { sendMessageToAI } from '../services/ai';
import { supabase } from '../utils/supabaseClient';
import { useChat } from '../context/ChatContext'; 
import configData from '../utils/config.json';

const ChatWindow = () => {
  
  const { 
    industry: activeIndustry, 
    isOpen, 
    setIsOpen, 
    messages, 
    addMessage, 
    isTyping, 
    setIsTyping,
    quickReplies,
    setQuickReplies
  } = useChat();

  const [inputText, setInputText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showProactive, setShowProactive] = useState(false);
  const messagesEndRef = useRef(null);

  // Trigger proactive greeting
  useEffect(() => {
    const timer = setTimeout(() => { if (!isOpen) setShowProactive(true); }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Auto-scroll
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

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

      // Use addMessage from context
      addMessage(`Thanks, ${data.name}! A specialized agent will contact you at ${data.email} shortly.`, 'bot');
      setShowForm(false);
    } catch (err) {
      console.error("Save Error:", err.message);
      alert("Error saving lead. Please try again.");
    }
  };

  
  const handleSend = async (content) => {
      let text = content;
      if (content && content.preventDefault) {
        content.preventDefault();
        text = inputText;
      }
      if (!text || typeof text !== 'string' || !text.trim()) return;

      // 1. User Message
      addMessage(text, 'user');
      setInputText("");
      setIsTyping(true);
      setQuickReplies([]); // Hide buttons while thinking

      // 2. Get AI Response
      const rawResponse = await sendMessageToAI(text, configData.selected);
      setIsTyping(false);

      // 3. Check for Fallback (Lead Gen)
      if (rawResponse.includes("FALLBACK_TRIGGER")) {
        setShowForm(true);
        return;
      }

      // 4. PARSE DYNAMIC RESPONSE (Split by |||)
      const parts = rawResponse.split("|||");
      const botMessage = parts[0].trim();
      
      // Add the text part
      addMessage(botMessage, 'bot');

      // Update buttons if they exist
      if (parts[1]) {
        const newOptions = parts[1].split(',').map(s => s.trim());
        setQuickReplies(newOptions);
      } else {
        setQuickReplies([]); // No options provided
      }
    };

  return (
    <div className="cb-fixed cb-bottom-6 cb-right-6 cb-z-50 cb-font-sans">
      
      {/* Proactive Greeting Bubble */}
      {showProactive && !isOpen && (
        <div className="cb-absolute cb-bottom-20 cb-right-0 cb-w-64 cb-p-4 cb-bg-slate-900 cb-text-white cb-rounded-2xl cb-rounded-tr-none cb-shadow-2xl cb-border cb-border-slate-700 cb-animate-bounce">
          <button onClick={() => setShowProactive(false)} className="cb-absolute cb-top-2 cb-right-2">
            <X size={14} className="cb-text-slate-400 hover:cb-text-white"/>
          </button>
          <div className="cb-flex cb-gap-3 cb-items-center">
            <div className="cb-w-8 cb-h-8 cb-bg-blue-600 cb-rounded-full cb-flex cb-items-center cb-justify-center">
               <Bot size={16} />
            </div>
            <p className="cb-text-xs cb-font-medium">{activeIndustry.welcome}</p>
          </div>
        </div>
      )}

      {/* Launcher Button (Pulse Effect) */}
      <button 
        onClick={() => { setIsOpen(!isOpen); setShowProactive(false); }}
        className={`cb-group cb-relative cb-w-16 cb-h-16 cb-rounded-full cb-flex cb-items-center cb-justify-center cb-shadow-2xl cb-transition-all hover:cb-scale-110 active:cb-scale-95 ${activeIndustry.color}`}
      >
        <div className="cb-absolute cb-inset-0 cb-rounded-full cb-bg-white cb-opacity-20 group-hover:cb-animate-ping"></div>
        {isOpen ? <X color="white" size={28} /> : <Sparkles color="white" size={28} />}
      </button>

      {/* MAIN CHAT WINDOW */}
      {isOpen && (
        <div className="cb-absolute cb-bottom-24 cb-right-0 cb-w-[380px] cb-h-[450px] cb-bg-white/95 cb-backdrop-blur-2xl cb-rounded-3xl cb-shadow-2xl cb-border cb-border-white/50 cb-flex cb-flex-col cb-overflow-hidden cb-animate-in cb-slide-in-from-bottom-10 cb-duration-300">
          
          {/* 1. Header with Gradient */}
          <div className={`cb-p-6 cb-bg-gradient-to-r cb-from-slate-900 cb-to-slate-800 cb-text-white cb-rounded-t-3xl cb-shadow-lg cb-relative cb-overflow-hidden`}>
             <div className="cb-absolute cb-top-0 cb-right-0 cb-w-32 cb-h-32 cb-bg-white cb-opacity-5 cb-rounded-full cb-blur-2xl cb-translate-x-10 cb--translate-y-10"></div>
             
             <div className="cb-flex cb-items-center cb-justify-between cb-relative cb-z-10">
                <div className="cb-flex cb-items-center cb-gap-3">
                   <div className="cb-relative">
                      <div className={`cb-w-10 cb-h-10 cb-rounded-full cb-flex cb-items-center cb-justify-center cb-text-white cb-shadow-inner ${activeIndustry.color}`}>
                        <Bot size={20} />
                      </div>
                      <span className="cb-absolute cb-bottom-0 cb-right-0 cb-w-3 cb-h-3 cb-bg-green-500 cb-border-2 cb-border-slate-900 cb-rounded-full"></span>
                   </div>
                   <div>
                      <h3 className="cb-font-bold cb-text-base">{activeIndustry.botName}</h3>
                      <p className="cb-text-xs cb-text-slate-300">AI Specialist • Online</p>
                   </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="cb-p-2 cb-bg-white/10 cb-rounded-full hover:cb-bg-white/20">
                  <ChevronDown size={18} />
                </button>
             </div>
          </div>

          {/* 2. Messages Area (Gray Background) */}
          <div className="cb-flex-1 cb-p-4 cb-overflow-y-auto cb-bg-slate-50 cb-space-y-6">
            <p className="cb-text-center cb-text-[10px] cb-text-slate-400 cb-font-medium cb-uppercase cb-tracking-widest">Today</p>
            
            {messages.map((msg) => (
              <div key={msg.id} className={`cb-flex cb-w-full cb-gap-2 ${msg.sender === 'user' ? 'cb-flex-row-reverse' : 'cb-flex-row'}`}>
                
                {/* Avatar Icon */}
                <div className={`cb-w-8 cb-h-8 cb-rounded-full cb-flex cb-items-center cb-justify-center cb-flex-shrink-0 ${msg.sender === 'user' ? 'cb-bg-slate-200' : `${activeIndustry.color} cb-text-white`}`}>
                  {msg.sender === 'user' ? <User size={14} className="cb-text-slate-600"/> : <Bot size={14}/>}
                </div>

                {/* Bubble */}
                <div className={`cb-max-w-[75%] cb-p-3.5 cb-rounded-2xl cb-text-sm cb-shadow-sm cb-leading-relaxed ${
                  msg.sender === 'user' 
                    ? `${activeIndustry.color} cb-text-white cb-rounded-tr-none` 
                    : 'cb-bg-white cb-text-slate-800 cb-border cb-border-slate-100 cb-rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {}
            {}
            {}
            {!isTyping && !showForm && quickReplies.length > 0 && (
              <div className="cb-flex cb-flex-wrap cb-gap-2 cb-pl-10 cb-animate-in cb-fade-in">
                {quickReplies.map((reply, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleSend(reply)}
                    className="cb-text-xs cb-bg-white cb-border cb-border-blue-200 cb-text-slate-700 cb-px-3 cb-py-1.5 cb-rounded-full hover:cb-bg-blue-50 hover:cb-text-blue-600 cb-transition-all"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {isTyping && (
              <div className="cb-flex cb-gap-2 cb-items-center">
                 <div className={`cb-w-8 cb-h-8 cb-rounded-full ${activeIndustry.color} cb-flex cb-items-center cb-justify-center cb-text-white`}>
                    <Bot size={14}/>
                 </div>
                 <div className="cb-bg-white cb-border cb-border-slate-100 cb-px-4 cb-py-3 cb-rounded-2xl cb-rounded-tl-none cb-shadow-sm cb-flex cb-gap-1">
                    <div className="cb-w-1.5 cb-h-1.5 cb-bg-slate-400 cb-rounded-full cb-animate-bounce" />
                    <div className="cb-w-1.5 cb-h-1.5 cb-bg-slate-400 cb-rounded-full cb-animate-bounce [animation-delay:0.2s]" />
                    <div className="cb-w-1.5 cb-h-1.5 cb-bg-slate-400 cb-rounded-full cb-animate-bounce [animation-delay:0.4s]" />
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 3. Input / Form Area (Floating Glass) */}
          <div className="cb-p-4 cb-bg-white cb-border-t cb-border-slate-100">
            {!showForm ? (
              <form onSubmit={handleSend} className="cb-relative">
                <input 
                  value={inputText} 
                  onChange={(e) => setInputText(e.target.value)} 
                  placeholder="Ask a question..." 
                  className="cb-w-full cb-pl-4 cb-pr-12 cb-py-3.5 cb-bg-slate-100 cb-text-slate-900 cb-placeholder-slate-500 cb-rounded-full cb-text-sm focus:cb-outline-none focus:cb-ring-2 focus:cb-ring-slate-300 focus:cb-bg-white cb-transition-all"
                />
                <button 
                  type="submit" 
                  className={`cb-absolute cb-right-1.5 cb-top-1.5 cb-p-2 cb-rounded-full ${activeIndustry.color} cb-text-white cb-shadow-md hover:cb-scale-105 cb-transition-transform`}
                  disabled={!inputText.trim()}
                >
                  <Send size={16} />
                </button>
              </form>
            ) : (
              <div className="cb-animate-in cb-fade-in cb-slide-in-from-bottom-5">
                <div className="cb-flex cb-items-center cb-gap-2 cb-mb-3">
                   <div className="cb-p-1.5 cb-bg-green-100 cb-rounded-full cb-text-green-700"><Phone size={14}/></div>
                   <p className="cb-text-xs cb-font-bold cb-text-slate-800 cb-uppercase">Callback Request</p>
                </div>
                <form onSubmit={handleLeadSubmit} className="cb-space-y-2">
                   <input name="name" placeholder="Your Name" className="cb-w-full cb-p-3 cb-bg-slate-50 cb-border cb-border-slate-200 cb-rounded-xl cb-text-sm cb-text-slate-900 focus:cb-ring-2 focus:cb-ring-blue-500/20 focus:cb-outline-none" required />
                   <input name="email" type="email" placeholder="Email Address" className="cb-w-full cb-p-3 cb-bg-slate-50 cb-border cb-border-slate-200 cb-rounded-xl cb-text-sm cb-text-slate-900 focus:cb-ring-2 focus:cb-ring-blue-500/20 focus:cb-outline-none" required />
                   <input name="phone" type="tel" placeholder="Phone Number" className="cb-w-full cb-p-3 cb-bg-slate-50 cb-border cb-border-slate-200 cb-rounded-xl cb-text-sm cb-text-slate-900 focus:cb-ring-2 focus:cb-ring-blue-500/20 focus:cb-outline-none" required />
                   <button className={`${activeIndustry.color} cb-w-full cb-text-white cb-py-3 cb-rounded-xl cb-text-sm cb-font-bold cb-shadow-lg hover:cb-opacity-90 cb-transition-opacity`}>
                     Confirm Request
                   </button>
                </form>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default ChatWindow;