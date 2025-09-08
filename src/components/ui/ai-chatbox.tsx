'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AIChatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          content: 'Hello! I\'m your DonorMatch AI assistant. How can I help you with blood donation today?',
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call your backend API
      // For now, we'll simulate a response after a delay
      setTimeout(() => {
        const aiResponses = [
          "Based on your blood type, you're eligible to donate at any of our partner hospitals. Would you like me to find the nearest one?",
          "Your last donation was 3 months ago, which means you're eligible to donate again now. Would you like to schedule an appointment?",
          "According to our records, your blood type is in high demand right now. Your donation could help save up to 3 lives!",
          "I've analyzed the current blood supply levels, and we're experiencing a shortage of your blood type. Your donation would be extremely valuable.",
          "Based on your location, I can see there's an emergency need for blood donations at Memorial Hospital, just 3.2 miles from you."
        ];
        
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        
        const aiMessage: Message = {
          id: Date.now().toString(),
          content: randomResponse,
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: 'Sorry, I encountered an error. Please try again later.',
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Chat button */}
      <motion.button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-red-600 text-white shadow-lg ${isOpen ? 'hidden' : 'flex'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bot size={24} />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: isMinimized ? '60px' : '500px' }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              height: isMinimized ? '60px' : '500px',
              width: isMinimized ? '300px' : '350px'
            }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#8B0000] to-[#DC143C] p-3 flex justify-between items-center">
              <div className="flex items-center">
                <Bot size={20} className="text-white mr-2" />
                <h3 className="text-white font-medium">DonorMatch AI Assistant</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={toggleMinimize} className="text-white hover:text-gray-200">
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button onClick={toggleChat} className="text-white hover:text-gray-200">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages area */}
            {!isMinimized && (
              <div className="flex-1 p-4 overflow-y-auto bg-gray-800">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                  >
                    <div 
                      className={`inline-block p-3 rounded-lg ${msg.sender === 'user' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-700 text-white'}`}
                    >
                      {msg.content}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300"></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input area */}
            {!isMinimized && (
              <div className="p-3 bg-gray-900 border-t border-gray-700">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about blood donation..."
                    className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-l-md text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!message.trim() || isLoading}
                    className="p-2 bg-red-600 text-white rounded-r-md hover:bg-red-700 focus:outline-none"
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}