import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const MessageBubble = ({ message }) => {
    const isBot = message.sender === 'bot';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`message-row ${isBot ? 'bot' : 'user'}`}
        >
            <div className={`message-bubble ${isBot ? 'bot' : 'user'}`}>
                <p style={{ margin: 0, lineHeight: 1.5 }}>{message.text}</p>
                <span
                    style={{ display: 'block', fontSize: '10px', opacity: 0.6, marginTop: '5px', textTransform: 'uppercase' }}
                >
                    {isBot ? 'AI Agent' : 'User'}
                </span>
            </div>
        </motion.div>
    );
};

export default MessageBubble;
