import React, { useState, useEffect, useRef } from 'react';
import { useBot } from '../context/BotContext';
import { useMockLLM } from '../hooks/useMockLLM';
import MessageBubble from './MessageBubble';
import { Send, Bot } from 'lucide-react';

const ChatWindow = () => {
    const { botConfig, setBotConfig, chatHistory, addMessage } = useBot();
    const { generateResponse, isTyping } = useMockLLM(botConfig);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    };

    useEffect(scrollToBottom, [chatHistory, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const userText = inputValue;
        setInputValue('');
        addMessage('user', userText);

        // Command Parsing Logic
        // Regex for "change color to [color]" or "/color [color]"
        const colorRegex = /(?:change|set) colou?r to\s+([a-zA-Z]+|#[0-9a-fA-F]{3,6})|^\/color\s+([a-zA-Z]+|#[0-9a-fA-F]{3,6})/i;
        const match = userText.match(colorRegex);

        if (match) {
            const newColor = match[1] || match[2];
            console.log("Detected color command:", newColor);
            setBotConfig(prev => ({ ...prev, avatarColor: newColor }));
            // We still let the LLM reply to maintain immersion
        }

        const response = await generateResponse(userText, chatHistory);
        addMessage('bot', response);
    };

    return (
        <div className="glass-panel chat-window scanlines">
            {/* Minimal Header */}
            <div className="chat-header" style={{ padding: '0.75rem 1rem', minHeight: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="avatar" style={{ width: '32px', height: '32px' }}>
                        <Bot size={18} color="#fff" />
                    </div>
                    <span className="text-sm neon-text" style={{ fontWeight: '600' }}>Chat</span>
                </div>
            </div>

            {/* Messages */}
            <div className="messages-list">
                {chatHistory.map(msg => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                {isTyping && (
                    <div className="message-row bot">
                        <div className="typing-indicator">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="input-area">
                <form onSubmit={handleSend} className="input-wrapper">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={`Message ${botConfig.name}...`}
                        style={{ paddingRight: '50px' }}
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isTyping}
                        className="btn-icon send-btn"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
