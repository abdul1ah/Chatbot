import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChatProvider } from './context/ChatContext';


const WIDGET_ID = 'ai-widget-root';
let rootElement = document.getElementById(WIDGET_ID);

if (!rootElement) {
  rootElement = document.createElement('div');
  rootElement.id = WIDGET_ID;
  document.body.appendChild(rootElement);
}

// 2. Mount the React App
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChatProvider>
      <App />
    </ChatProvider>
  </React.StrictMode>,
)