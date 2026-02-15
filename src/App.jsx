import React from 'react';
import ChatWindow from './components/ChatWindow';

function App() {

  return (
    <div className="cb-w-full cb-h-screen cb-bg-[#020617] cb-relative cb-overflow-hidden">
      
      {/* 1. BACKGROUND LAYER (Z-Index 0) */}
      <div className="cb-fixed cb-inset-0 cb-pointer-events-none cb-z-0">
        <div className="cb-absolute cb--top-24 cb--left-24 cb-w-[600px] cb-h-[600px] cb-bg-blue-600/30 cb-rounded-full cb-blur-[120px]"></div>
        <div className="cb-absolute cb-top-1/2 cb-left-1/2 cb--translate-x-1/2 cb--translate-y-1/2 cb-w-[800px] cb-h-[800px] cb-bg-indigo-600/10 cb-rounded-full cb-blur-[160px]"></div>
        <div className="cb-absolute cb-bottom-0 cb-right-0 cb-w-[700px] cb-h-[700px] cb-bg-purple-600/20 cb-rounded-full cb-blur-[150px]"></div>
      </div>

      {/* 2. TEXT LAYER (Z-Index 10 - Fixed Center) 
          - Changed to 'fixed' to ensure it stays on screen 
          - Changed text to 'white' so it pops against the dark background 
      */}
      <div className="cb-fixed cb-inset-0 cb-flex cb-items-center cb-justify-center cb-z-10 cb-pointer-events-none">
        <h1 className="cb-text-white/80 cb-text-xl cb-font-medium cb-tracking-[0.5em] cb-uppercase cb-animate-pulse cb-drop-shadow-lg">
          AI Industry Chatbot
        </h1>
      </div>

      {/* 3. WIDGET LAYER (Z-Index 50 - Handled inside ChatWindow) */}
      <ChatWindow />
      
      {/* TAILWIND SAFE LIST (Keep this so Green/Blue themes work!)
         cb-bg-blue-600 cb-bg-teal-600 
      */}
    </div>
  );
}

export default App;