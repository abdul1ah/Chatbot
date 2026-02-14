import React from 'react';
import ChatWindow from './components/ChatWindow';

function App() {
  return (
    <div className="cb-min-h-screen cb-bg-[#020617] cb-relative cb-overflow-hidden cb-flex cb-items-center cb-justify-center">
      
      {}
      <div className="cb-absolute cb-inset-0 cb-pointer-events-none">
        {}
        <div className="cb-absolute cb--top-24 cb--left-24 cb-w-[600px] cb-h-[600px] cb-bg-blue-600/30 cb-rounded-full cb-blur-[120px]"></div>
        
        {}
        <div className="cb-absolute cb-top-1/2 cb-left-1/2 cb--translate-x-1/2 cb--translate-y-1/2 cb-w-[800px] cb-h-[800px] cb-bg-indigo-600/10 cb-rounded-full cb-blur-[160px]"></div>
        
        {}
        <div className="cb-absolute cb-bottom-0 cb-right-0 cb-w-[700px] cb-h-[700px] cb-bg-purple-600/20 cb-rounded-full cb-blur-[150px]"></div>
      </div>

      {}
      <div className="cb-z-10">
        <h1 className="cb-text-slate-500 cb-text-sm cb-font-medium cb-tracking-widest cb-uppercase">
          AI Widget Environment
        </h1>
      </div>

      <ChatWindow />
    </div>
  );
}

export default App;