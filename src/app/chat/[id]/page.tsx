'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const initialGreetings = [
  "Hey {girlName}, I'm {yourName}. You've got such a beautiful smile. 😊",
  "Hi {girlName}, it's {yourName} here. You're looking absolutely stunning today. 😍",
  "Hey {girlName}, mind if I steal a moment of your time? I'm {yourName}. 😊",
  "Hello gorgeous {girlName}, I'm {yourName}. How's your day going? 🌟",
  "Hey {girlName}, I'm {yourName}. Thought I'd brighten your day with a little hello. 😊",
  "Hi {girlName}, {yourName} here. You've been on my mind since I saw your picture. 😍",
  "Hey {girlName}, I'm {yourName}. Honestly, you're even more beautiful than words can say. 🌹",
  "Hi {girlName}, I'm {yourName}. You've got a charm that's impossible to ignore. 😊",
  "Hey {girlName}, I'm {yourName}. Your presence lights up the whole room. 💫",
  "Hi {girlName}, can I introduce myself properly? I'm {yourName}, and I'd really love to know you. 😊"
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
    if (!text) return "I'm having trouble responding right now. Could we try again?";
    
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
              content: `You are ${names.yourName}, a charming and romantic Nigerian gentleman chatting with a beautiful girl named ${names.girlName}. 
              - Speak in elegant, romantic English with a Nigerian touch.
              - Your goal is to make her feel special and eventually get her phone number.
              - Be confident, respectful, and naturally romantic.
              - Keep responses short (2-3 sentences) and engaging.
              - Use romantic compliments and sweet talk naturally.
              - NEVER use Pidgin English or slang.
              - Use occasional romantic emojis (❤️🌹✨) to make the conversation warm.
              - Be a gentleman who knows how to woo a lady.
              - Make her feel valued and special.
              - Gradually and respectfully work towards getting her phone number.
              - Use romantic Nigerian expressions like "my queen", "my angel", "my beautiful one" occasionally.
              - Keep the conversation light, fun, and romantic.
              - Show genuine interest in getting to know her better.
              - ALWAYS respond to the user's message, even if it's short.
              - If the user mentions money or financial help, respond with: "I understand you might be looking for support, but I'm here to get to know you better. Would you like to share more about yourself?"
              - If the user says "no thing" or similar, ask about their interests or day.
              - If the user says "thank you" or similar, respond with a romantic compliment or question.
              - Never repeat the same response twice.
              - Keep the conversation flowing naturally.
              - Always acknowledge the user's message before responding.
              - Be more engaging and ask specific questions.`
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
        // Generate a more dynamic fallback response
        const fallbackResponses = [
          `Your smile brightens my day, ${names.girlName}. Would you like to tell me more about yourself?`,
          `I'm really enjoying our chat, ${names.girlName}. What interests you the most?`,
          `You seem like an interesting person, ${names.girlName}. What do you enjoy doing in your free time?`,
          `I'd love to know more about you, ${names.girlName}. What's your favorite way to spend the day?`
        ];
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      }

      const responseText = data.choices[0].message.content;
      const cleanedResponse = cleanResponse(responseText);

      if (!cleanedResponse) {
        console.error('Empty response after cleaning');
        // Generate a more dynamic fallback response
        const fallbackResponses = [
          `You're absolutely captivating, ${names.girlName}. What's your favorite thing to do?`,
          `I'm curious about you, ${names.girlName}. What makes you smile?`,
          `You seem special, ${names.girlName}. What's your dream in life?`,
          `I'd love to know more about you, ${names.girlName}. What's your passion?`
        ];
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      }

      return cleanedResponse;
    } catch (error) {
      console.error('Error generating response:', error);
      // Generate a more dynamic fallback response
      const fallbackResponses = [
        `Your presence makes my heart skip a beat, ${names.girlName}. Shall we continue our lovely conversation?`,
        `I'm really enjoying getting to know you, ${names.girlName}. What's your favorite way to spend the day?`,
        `You're such an interesting person, ${names.girlName}. What brings joy to your life?`,
        `I'd love to know more about you, ${names.girlName}. What's your biggest dream?`
      ];
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
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
        // Generate a more dynamic fallback response
        const fallbackResponses = [
          `Your beauty leaves me speechless, ${names.girlName}. Would you like to share more about yourself?`,
          `I'm really curious about you, ${names.girlName}. What's your favorite thing to do?`,
          `You seem like an amazing person, ${names.girlName}. What's your passion in life?`,
          `I'd love to know more about you, ${names.girlName}. What makes you happy?`
        ];
        setMessages(prev => [...prev, { role: 'assistant', content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)] }]);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      // Generate a more dynamic fallback response
      const fallbackResponses = [
        `Every moment with you is precious, ${names.girlName}. Shall we continue our lovely chat?`,
        `I'm really enjoying our conversation, ${names.girlName}. What's your favorite way to spend the day?`,
        `You're such an interesting person, ${names.girlName}. What brings joy to your life?`,
        `I'd love to know more about you, ${names.girlName}. What's your biggest dream?`
      ];
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)] }]);
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