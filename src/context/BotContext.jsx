import React, { createContext, useState, useContext } from 'react';

const BotContext = createContext();

export const useBot = () => useContext(BotContext);

export const BotProvider = ({ children }) => {
  const [botConfig, setBotConfig] = useState({
    name: 'Hologram',
    job: 'Digital Companion',
    bio: 'I am your digital self, here to help you create, connect, and play in the virtual world.',
    style: 'Hologram',
    avatarUrl: '/avatar.glb',
    avatarColor: '#00f2ff', // Default Cyan
    avatarShape: 'model',    // Default to loaded model
    openaiApiKey: ''        // User's OpenAI API Key
  });

  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: 'bot', text: "Hello! I'm ready to help. Configure my personality on the left!" }
  ]);

  const addMessage = (sender, text) => {
    const newMessage = {
      id: Date.now(),
      sender,
      text
    };
    setChatHistory(prev => [...prev, newMessage]);
  };

  const clearChat = () => {
    setChatHistory([{ id: Date.now(), sender: 'bot', text: `System reloaded. Hello, I am ${botConfig.name}.` }]);
  };

  return (
    <BotContext.Provider value={{ botConfig, setBotConfig, chatHistory, addMessage, clearChat }}>
      {children}
    </BotContext.Provider>
  );
};
