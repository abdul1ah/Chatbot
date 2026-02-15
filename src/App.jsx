import React from 'react';
import ChatWindow from './components/ChatWindow';

function App() {

  return (

    <div className="cb-w-full cb-h-screen cb-bg-[#020617] cb-relative cb-overflow-hidden cb-flex cb-items-center cb-justify-center cb-touch-none">
      
      {/* Background Gradients */}
      <div className="cb-fixed cb-inset-0 cb-pointer-events-none cb-z-0">
        <div className="cb-absolute cb--top-24 cb--left-24 cb-w-[600px] cb-h-[600px] cb-bg-blue-600/30 cb-rounded-full cb-blur-[120px]"></div>
        <div className="cb-absolute cb-top-1/2 cb-left-1/2 cb--translate-x-1/2 cb--translate-y-1/2 cb-w-[800px] cb-h-[800px] cb-bg-indigo-600/10 cb-rounded-full cb-blur-[160px]"></div>
        <div className="cb-absolute cb-bottom-0 cb-right-0 cb-w-[700px] cb-h-[700px] cb-bg-purple-600/20 cb-rounded-full cb-blur-[150px]"></div>
      </div>

      {/* Main Content - Force Center */}
      <div className="cb-relative cb-z-10 cb-text-center">
        <h1 className="cb-text-slate-400 cb-text-sm cb-font-medium cb-tracking-[0.3em] cb-uppercase cb-animate-pulse">
          AI Industry Chatbot
        </h1>
      </div>

      {/* The Chat Widget */}
      <ChatWindow />
      
      {/* TAILWIND SAFE LIST (Fixes the Color Issue) 
        We put these here so Tailwind sees them and doesn't delete them.
        cb-bg-blue-600 cb-bg-teal-600 
      */}
    </div>
  );
}

export default App;