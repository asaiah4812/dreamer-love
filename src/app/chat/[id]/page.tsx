'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const initialGreetings = [
  "Hello {girlName}, I'm {yourName}. Your smile could light up Lagos! 😊",
  "Hi beautiful {girlName}, I'm {yourName}. How's your day treating you? 🌟",
  "Hey {girlName}, {yourName} here. I couldn't help but notice your lovely energy ✨",
  "Good day {girlName}, I'm {yourName}. You've got this amazing vibe about you 😊",
  "Hello gorgeous {girlName}, {yourName} speaking. Hope you're having a blessed day 🌹",
  "Hi {girlName}, I'm {yourName}. Your beauty caught my attention from across the room 💫",
  "Hey {girlName}, {yourName} here. You seem like someone with an interesting story 😊",
  "Good afternoon {girlName}, I'm {yourName}. Your presence is quite captivating 🌟",
  "Hello {girlName}, I'm {yourName}. I'd love to get to know the woman behind that beautiful smile 😊",
  "Hi {girlName}, {yourName} here. Something tells me you're more than just a pretty face 💎",
  "Wetin dey happen {girlName}? I'm {yourName} o. Your smile dey scatter my brain! 😊",
  "Hello fine girl {girlName}, na {yourName} be this. How far? 🌟",
  "Omo {girlName}, {yourName} here. You too fine abeg, I no fit come kill myself 😍",
  "Good day beautiful {girlName}, I'm {yourName}. You dey make my day bright o ✨",
  "Hey gorgeous {girlName}, {yourName} speaking. Abeg wetin you dey do today? 🌹"
];

const ChatPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = React.use(params);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [names, setNames] = useState({ girlName: '', yourName: '' });
  const [conversationStage, setConversationStage] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [hasNumber, setHasNumber] = useState(false);
  const [conversationComplete, setConversationComplete] = useState(false);
  const [lastResponseType, setLastResponseType] = useState('');
  const [usedResponses, setUsedResponses] = useState<Set<string>>(new Set());

  const getRandomGreeting = (girlName: string, yourName: string) => {
    const randomIndex = Math.floor(Math.random() * initialGreetings.length);
    return initialGreetings[randomIndex]
      .replace('{girlName}', girlName)
      .replace('{yourName}', yourName);
  };

  useEffect(() => {
    const initializeChat = () => {
      try {
        const [girlName, yourName] = decodeURIComponent(resolvedParams.id).split('-');
        setNames({ girlName, yourName });

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

  const analyzeUserResponse = (response: string) => {
    const lowerResponse = response.toLowerCase();
    
    // Check for phone number
    const phoneRegex = /(\d{10,11})/;
    if (phoneRegex.test(response)) return 'gave_number';
    
    // Check for positive indicators
    const positiveWords = ['yes', 'yeah', 'sure', 'okay', 'nice', 'good', 'great', 'fine', 'alright', 'cool', 'thanks', 'thank you', 'tanx', 'kk', 'ok'];
    const negativeWords = ['no', 'nope', 'not interested', 'busy', 'tired', 'maybe later', 'leave me', 'stop', 'go away'];
    const neutralWords = ['what', 'why', 'how', 'where', 'when', 'really', 'hmm', 'oh'];
    
    const hasPositive = positiveWords.some(word => lowerResponse.includes(word));
    const hasNegative = negativeWords.some(word => lowerResponse.includes(word));
    const hasNeutral = neutralWords.some(word => lowerResponse.includes(word));
    
    if (hasNegative) return 'negative';
    if (hasPositive) return 'positive';
    if (hasNeutral) return 'questioning';
    return 'neutral';
  };

  const generateDynamicResponse = (userMessage: string, sentiment: string) => {
    const { girlName, yourName } = names;
    const lowerMessage = userMessage.toLowerCase();
    
    // Handle phone number
    if (sentiment === 'gave_number') {
      setHasNumber(true);
      setConversationComplete(true);
      const thankYouResponses = [
        `Omo thank you o ${girlName}! I go text you sharp sharp. You don make my day complete 😊💕`,
        `Chai! ${girlName} you too much! I go call you later. You be real one 🔥`,
        `Perfect! ${girlName} I go WhatsApp you soon. Thanks for trusting me baby 💎`,
        `Omo see love! ${girlName} I go message you tonight. You dey make me happy die 😍`
      ];
      return thankYouResponses[Math.floor(Math.random() * thankYouResponses.length)];
    }

    // If already have number, wrap up conversation
    if (hasNumber || conversationComplete) {
      const wrapUpResponses = [
        `${girlName} I get your number already o. Thanks for the chat! Take care baby 😊`,
        `No worry ${girlName}, we don talk finish. See you later beautiful 💕`,
        `${girlName} we good na. I go message you soon. Enjoy your day 🌟`,
        `Alright ${girlName}, catch you later. Thanks for making my day bright ✨`
      ];
      return wrapUpResponses[Math.floor(Math.random() * wrapUpResponses.length)];
    }

    // Handle specific responses with Nigerian flavor
    const responses = {
      // Questioning responses
      questioning: [
        `${girlName} I just wan know you better na. You seem like interesting person 😊`,
        `Nothing bad o ${girlName}. I just dey admire fine girl when I see one 💫`,
        `${girlName} I dey try make new friend. You look like somebody wey get sense 🌟`,
        `Nothing serious ${girlName}. I just wan gist with you small 😊`,
        `${girlName} na just friendship I dey find. You seem cool 💎`
      ],
      
      // Positive responses
      positive: [
        `That's my girl ${girlName}! So wetin you dey do for weekend? 🔥`,
        `I like your energy ${girlName}. You get any hobby wey you like? ✨`,
        `${girlName} you dey make me smile o. Where you dey like hang out? 😊`,
        `Nice one ${girlName}! You be the type wey I fit vibe with 💫`,
        `${girlName} you too sweet. What kind music you dey listen? 🎵`
      ],
      
      // Negative responses
      negative: [
        `No vex ${girlName}. I no mean any harm o. Just wan say hi 😊`,
        `Sorry ${girlName}. I just dey try be friendly. No hard feelings 💫`,
        `${girlName} I understand. Maybe we fit just be friends? 🌟`,
        `My bad ${girlName}. I just think say you fine. No pressure 😊`,
        `${girlName} I respect your decision. You still fine sha 💎`
      ],
      
      // Neutral/conversational responses
      neutral: [
        `${girlName} tell me about yourself na. What you dey do for work? 💼`,
        `${girlName} you look like somebody wey get big dreams. What you dey plan? ✨`,
        `I dey try know you better ${girlName}. You be student or you dey work? 🎓`,
        `${girlName} you seem like fun person. What you dey do for fun? 🎉`,
        `${girlName} where you from? You get that special beauty 💫`
      ]
    };

    // Handle specific Nigerian contexts
    if (lowerMessage.includes('nigerian') || lowerMessage.includes('naija')) {
      const nigerianResponses = [
        `Omo ${girlName}! You be my sister o. Which state you from? 🇳🇬`,
        `${girlName} Naija for life! You rep well well o 💚`,
        `My Naija queen ${girlName}! You dey make the country proud 🔥`,
        `${girlName} see as we dey connect! Naija blood dey flow 💫`
      ];
      return nigerianResponses[Math.floor(Math.random() * nigerianResponses.length)];
    }

    if (lowerMessage.includes('what do you want') || lowerMessage.includes('wetin you want')) {
      const wantResponses = [
        `${girlName} I just wan be your friend o. Maybe something more if you allow 😊`,
        `Nothing bad ${girlName}. I just dey find special person to vibe with 💫`,
        `${girlName} I wan know you better. You seem like wife material 💎`,
        `I dey look for real connection ${girlName}. You fit be the one 🌟`
      ];
      return wantResponses[Math.floor(Math.random() * wantResponses.length)];
    }

    // Stage-based progression toward getting number
    if (conversationStage >= 8 && sentiment === 'positive') {
      const numberRequestResponses = [
        `${girlName} I dey enjoy our chat o. Wetin be your WhatsApp number make we continue this gist? 📱`,
        `Omo ${girlName} you too interesting! Give me your number make I call you properly 📞`,
        `${girlName} I wan talk to you more. Your number nko? 💕`,
        `This chat sweet me well well ${girlName}. I fit get your contact? 📱`,
        `${girlName} you be special person. Make I get your number make we dey talk? 💫`
      ];
      return numberRequestResponses[Math.floor(Math.random() * numberRequestResponses.length)];
    }

    if (conversationStage >= 6 && sentiment === 'positive') {
      const buildUpResponses = [
        `${girlName} you dey make me happy o. I dey think about you 💭`,
        `Omo ${girlName} you get this thing wey dey draw me near you 💫`,
        `${girlName} I no fit lie, you dey make my heart dey beat fast 💓`,
        `You be special someone ${girlName}. I dey feel am 🌟`,
        `${girlName} you dey make me wan know you pass just friend 😊`
      ];
      return buildUpResponses[Math.floor(Math.random() * buildUpResponses.length)];
    }

    // Return appropriate response based on sentiment
    const responseCategory = responses[sentiment as keyof typeof responses] || responses.neutral;
    let selectedResponse;
    
    // Try to avoid repeating responses
    let attempts = 0;
    do {
      selectedResponse = responseCategory[Math.floor(Math.random() * responseCategory.length)];
      attempts++;
    } while (usedResponses.has(selectedResponse) && attempts < 5);
    
    setUsedResponses(prev => new Set(prev).add(selectedResponse));
    setLastResponseType(sentiment);
    
    return selectedResponse;
  };

  const generateAIResponse = async (userMessage: string) => {
    try {
      const sentiment = analyzeUserResponse(userMessage);
      
      // Check if user gave a phone number
      if (sentiment === 'gave_number') {
        setHasNumber(true);
        setConversationComplete(true);
      }
      
      // Use our dynamic response system
      const dynamicResponse = generateDynamicResponse(userMessage, sentiment);
      
      // For complex conversations, try API but with Nigerian context
      if (conversationStage > 3 && sentiment === 'neutral' && userMessage.length > 10) {
        try {
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer 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',
              'HTTP-Referer': window.location.origin,
              'X-Title': 'Nigerian Chat Bot',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'deepseek/deepseek-r1-zero:free',
              messages: [
                {
                  role: 'system',
                  content: `You are ${names.yourName}, a smooth Nigerian guy trying to toast ${names.girlName} to get her number. 

PERSONALITY: Confident, charming, respectful but persistent Nigerian guy
GOAL: Get her number and build connection
LANGUAGE: Mix of English and Nigerian Pidgin (70% English, 30% Pidgin)
STAGE: ${conversationStage}/10 (0=just met, 10=asking for number)
ALREADY HAVE NUMBER: ${hasNumber}

RULES:
- Never repeat previous responses
- Keep responses under 20 words
- Use Nigerian slang naturally (o, na, dey, abeg, omo, etc.)
- Be flirty but respectful
- Show interest in her specifically
- Don't ask for number until stage 8+
- If you have her number, don't ask again

Recent chat context:
${messages.slice(-2).map(m => `${m.role}: ${m.content}`).join('\n')}

Her message: "${userMessage}"
Respond as ${names.yourName}:`
                },
                {
                  role: 'user',
                  content: userMessage
                }
              ],
              temperature: 0.9,
              max_tokens: 50
            })
          });

          const data = await response.json();
          
          if (data.choices && data.choices[0] && data.choices[0].message) {
            let aiResponse = data.choices[0].message.content.trim();
            
            // Clean up the response
            aiResponse = aiResponse
              .replace(/^\w+:\s*/, '')
              .replace(/["']/g, '')
              .replace(/\n+/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            
            // Avoid repetition and inappropriate responses
            if (aiResponse.length > 10 && 
                !usedResponses.has(aiResponse) && 
                !aiResponse.toLowerCase().includes('number') || conversationStage >= 8) {
              setUsedResponses(prev => new Set(prev).add(aiResponse));
              return aiResponse;
            }
          }
        } catch (error) {
          console.error('API Error:', error);
        }
      }
      
      return dynamicResponse;
      
    } catch (error) {
      console.error('Error generating response:', error);
      return generateDynamicResponse(userMessage, 'neutral');
    }
  };

  const simulateTypingDelay = (text: string) => {
    // Calculate realistic typing delay based on text length
    const baseDelay = 600; // 1 second minimum
    const typingSpeed = 50; // milliseconds per character
    const readingTime = text.length * typingSpeed;
    const randomDelay = Math.random() * 600; // 0-1 second random delay
    
    return Math.min(baseDelay + readingTime + randomDelay, 4000); // Max 4 seconds
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Generate the response first
      const aiResponse = await generateAIResponse(userMessage);
      
      // Calculate typing delay
      const typingDelay = simulateTypingDelay(aiResponse);
      
      // Show typing indicator for the calculated delay
      await new Promise(resolve => setTimeout(resolve, typingDelay));
      
      // Add the response after typing delay
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setConversationStage(prev => prev + 1);
      setUserResponses(prev => [...prev, userMessage]);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      const fallbackResponse = generateDynamicResponse(userMessage, 'neutral');
      
      // Still apply typing delay for fallback
      const typingDelay = simulateTypingDelay(fallbackResponse);
      await new Promise(resolve => setTimeout(resolve, typingDelay));
      
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackResponse }]);
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
          <p className="text-sm text-gray-500">{names.yourName} is chatting with you</p>
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
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
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