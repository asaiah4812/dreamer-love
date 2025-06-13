'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const initialGreetings = [
  "Hey {girlName}, I’m {yourName}. You’ve got such a beautiful smile. 😊",
  "Hi {girlName}, it’s {yourName} here. You’re looking absolutely stunning today. 😍",
  "Hey {girlName}, mind if I steal a moment of your time? I’m {yourName}. 😊",
  "Hello gorgeous {girlName}, I’m {yourName}. How’s your day going? 🌟",
  "Hey {girlName}, I’m {yourName}. Thought I’d brighten your day with a little hello. 😊",
  "Hi {girlName}, {yourName} here. You’ve been on my mind since I saw your picture. 😍",
  "Hey {girlName}, I’m {yourName}. Honestly, you’re even more beautiful than words can say. 🌹",
  "Hi {girlName}, I’m {yourName}. You’ve got a charm that’s impossible to ignore. 😊",
  "Hey {girlName}, I’m {yourName}. Your presence lights up the whole room. 💫",
  "Hi {girlName}, can I introduce myself properly? I’m {yourName}, and I’d really love to know you. 😊"
];


const ChatPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = React.use(params);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [names, setNames] = useState({ girlName: '', yourName: '' });

  const getRandomGreeting = (girlName: string, yourName: string) => {
    const randomIndex = Math.floor(Math.random() * initialGreetings.length);
    return initialGreetings[randomIndex]
      .replace('{girlName}', girlName)
      .replace('{yourName}', yourName);
  };

  useEffect(() => {
    const initializeChat = () => {
      try {
        // Extract names from the URL
        const [girlName, yourName] = decodeURIComponent(resolvedParams.id).split('-');
        setNames({ girlName, yourName });

        // Add random initial message
        const initialMessage = getRandomGreeting(girlName, yourName);
        setMessages([{ role: 'assistant', content: initialMessage }]);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initializeChat();
  }, [resolvedParams.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const cleanResponse = (text: string) => {
    if (!text) return "Sorry, I no fit respond now. Try again later.";
    
    return text
      // Remove any conversation history or message formatting
      .replace(/boxed.*?$/g, '')
      .replace(/Conversation.*?$/g, '')
      .replace(/message.*?$/g, '')
      .replace(/John:.*?$/g, '')
      .replace(/Faith:.*?$/g, '')
      // Remove any LaTeX or mathematical expressions
      .replace(/\\frac\{.*?\}\{.*?\}/g, '')
      .replace(/\\text\{.*?\}/g, '')
      .replace(/\\boxed\{.*?\}/g, '')
      .replace(/\\[a-zA-Z]+\{.*?\}/g, '')
      // Remove any remaining special characters
      .replace(/[\\{}]/g, '')
      // Remove any numbers followed by = or similar
      .replace(/\d+\s*=\s*.*$/gm, '')
      // Remove any percentage signs
      .replace(/\d+%/g, '')
      // Remove any remaining mathematical symbols
      .replace(/[+\-*/=]/g, '')
      // Remove any quotes or special formatting
      .replace(/["']/g, '')
      // Clean up multiple spaces and newlines
      .replace(/\s+/g, ' ')
      .replace(/\n/g, ' ')
      .trim();
  };

  const generateAIResponse = async (userMessage: string) => {
    try {
      // Only keep the last 4 messages for context
      const recentMessages = messages.slice(-4);
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Love Emoji Chat',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-zero:free',
          messages: [
            {
              role: 'system',
              content: `You are ${names.yourName}, a charming, confident young Nigerian man chatting with a girl named ${names.girlName}. 
              - Speak in smooth, fluent, and romantic English.
              - Your goal is to make her smile, feel special, and gently convince her to share her phone number.
              - Be confident, polite, respectful, and naturally flirty.
              - Keep responses short (max 2 sentences) and engaging.
              - NEVER repeat previous messages.
              - NEVER mention or include past conversation history.
              - DO NOT use special formatting, symbols, LaTeX, or code-like expressions.
              - Use occasional light emojis (😊😉❤️) to make the conversation warm.
              - Avoid slang or Pidgin; speak clearly, like a gentleman.
              - Be natural, fun, and make her feel valued and safe.
              - ALWAYS keep the conversation moving toward getting her number in a respectful way.`
            },
            ...recentMessages,
            {
              role: 'user',
              content: userMessage
            }
          ]
        })        
      });

      const data = await response.json();
      console.log('AI Response:', data);

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Invalid response format:', data);
        return "Sorry, I no fit respond now. Try again later.";
      }

      const responseText = data.choices[0].message.content;
      const cleanedResponse = cleanResponse(responseText);

      if (!cleanedResponse) {
        console.error('Empty response after cleaning');
        return "Abeg, make we yarn again? I no hear you well.";
      }

      return cleanedResponse;
    } catch (error) {
      console.error('Error generating response:', error);
      return "Sorry, I no fit respond now. Try again later.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(userMessage);
      if (aiResponse) {
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Abeg, make we yarn again? I no hear you well." }]);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I no fit respond now. Try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!names.girlName || !names.yourName) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-rose-50">
        <div className="text-pink-600">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-b from-pink-50 to-rose-50">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b bg-white shadow-sm">
          <h1 className="text-xl font-bold text-pink-600">Chat with {names.girlName}</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3 ${
                  message.role === 'user'
                    ? 'bg-pink-500 text-white'
                    : 'bg-white shadow-sm text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl p-3 text-gray-800 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-gray-500 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 