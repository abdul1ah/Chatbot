import React, { useState } from 'react';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && <ChatWindow />}
      <ChatButton isOpen={isOpen} toggleChat={() => setIsOpen(!isOpen)} />
    </>
  );
};

export default ChatWidget;