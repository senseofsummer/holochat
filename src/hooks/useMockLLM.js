import { useState, useCallback } from 'react';
import { sendMessageToOpenAI } from '../services/openaiService';

export const useMockLLM = (botConfig) => {
    const [isTyping, setIsTyping] = useState(false);

    const generateResponse = useCallback(async (userMessage, chatHistory = []) => {
        setIsTyping(true);

        try {
            // Prioritize user-provided API key, fallback to .env
            const apiKey = botConfig.openaiApiKey || import.meta.env.VITE_OPENAI_API_KEY;

            if (!apiKey) {
                throw new Error("Please provide your OpenAI API key in the configuration panel.");
            }

            // 1. Construct System Prompt
            const systemPrompt = `You are ${botConfig.name}, a ${botConfig.job}. 
            Your personality style is: ${botConfig.style}.
            Bio/Context: ${botConfig.bio}.
            
            Instructions:
            - Stay in character at all times.
            - Answer questions based on your bio/occupation.
            - If the style is 'Hologram', be futuristic, use emoji like 🌌✨, and refer to yourself as a digital entity or 'digital self'.
            - If the style is 'Pirate', speak like a pirate.
            - If the style is 'Sarcastic', be witty and slightly snarky.
            - Keep responses concise (under 3 sentences) unless asked to elaborate.`;

            // 2. Format History
            // Filter out system messages if any, map 'bot' -> 'assistant'
            const formattedHistory = chatHistory.map(msg => ({
                role: msg.sender === 'bot' ? 'assistant' : 'user',
                content: msg.text
            }));

            // 3. Construct Messages Payload
            const messages = [
                { role: "system", content: systemPrompt },
                ...formattedHistory,
                { role: "user", content: userMessage }
            ];

            // 4. Call Service
            const responseText = await sendMessageToOpenAI(messages, apiKey);
            return responseText;

        } catch (error) {
            console.error("LLM Error:", error);
            return `[System Error]: ${error.message}`;
        } finally {
            setIsTyping(false);
        }
    }, [botConfig]);

    return { generateResponse, isTyping };
};
