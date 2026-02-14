import React from 'react';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <div className="cb-relative">
       {/* The ChatWidget handles its own positioning (fixed bottom-right) */}
      <ChatWidget />
    </div>
  );
}

export default App;