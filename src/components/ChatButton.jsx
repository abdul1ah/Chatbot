import React from 'react';
import { MessageCircle, X } from 'lucide-react';

const ChatButton = ({ isOpen, toggleChat }) => {
  return (
    <button
      onClick={toggleChat}
      className="cb-fixed cb-bottom-6 cb-right-6 cb-bg-blue-600 cb-text-white cb-p-4 cb-rounded-full cb-shadow-lg cb-hover:bg-blue-700 cb-transition-all cb-z-50 cb-flex cb-items-center cb-justify-center"
      aria-label="Toggle Chat"
    >
      {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
    </button>
  );
};

export default ChatButton;