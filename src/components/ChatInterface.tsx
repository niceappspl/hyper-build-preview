import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  initialPrompt?: string;
  onSendMessage?: (message: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  initialPrompt = '',
  onSendMessage 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() !== '') {
      // Add initial prompt directly as first messages
      const userMessage: Message = {
        id: '1',
        content: initialPrompt,
        sender: 'user',
        timestamp: new Date()
      };
      
      const aiResponse: Message = {
        id: '2',
        content: `I understand. I'll help you build an app that includes: "${initialPrompt}". Would you like to add any other features or requirements?`,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages([userMessage, aiResponse]);
      
      // Notify parent component
      onSendMessage?.(initialPrompt);
    }
  }, [initialPrompt, onSendMessage]);
  
  // Auto-scroll to the last message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleSendMessage = (content = inputValue) => {
    if (!content.trim()) return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    
    // Simulate AI response
    simulateAiResponse(content);
    
    // Callback
    onSendMessage?.(content);
  };
  
  const simulateAiResponse = (userMessage: string) => {
    setIsAiTyping(true);
    
    setTimeout(() => {
      const aiResponse = `I understand. I'll help you build an app that includes: "${userMessage}". Would you like to add any other features or requirements?`;
      
      const newAiMessage: Message = {
        id: Date.now().toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAiMessage]);
      setIsAiTyping(false);
    }, 1500);
  };
  
  return (
    <div className="flex flex-col h-full relative">
      {/* Zaawansowane tło z gradientami, siatką i orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtelna siatka */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        {/* Gradient nakładka */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/70 to-transparent" />
        
        {/* Gradient orbs - jaśniejsze */}
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-gradient-to-r from-blue-500/15 to-blue-700/15 rounded-full blur-[80px] opacity-60" />
        <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-gradient-to-r from-purple-400/15 to-cyan-500/15 rounded-full blur-[80px] opacity-60" />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-[#0a0a0a] to-black relative z-10">
        <AnimatePresence initial={false}>
          {messages.map(message => (
            <motion.div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 last:mb-0`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {message.sender === 'ai' && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mr-2 flex-shrink-0 shadow-lg">
                  <div className="w-6 h-6 bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col">
                    <div className="h-1/5 bg-blue-300"></div>
                    <div className="h-1/5 bg-blue-400"></div>
                    <div className="h-1/5 bg-blue-500"></div>
                    <div className="h-1/5 bg-blue-600"></div>
                    <div className="h-1/5 bg-blue-700"></div>
                  </div>
                </div>
              )}
              
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-md relative ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-blue-600/90 to-cyan-600/90 text-white rounded-tr-none backdrop-blur-sm' 
                  : 'bg-[#121212] text-white rounded-tl-none border border-neutral-800/80 backdrop-blur-sm'
              }`}>
                {/* Subtle glow for AI messages */}
                {message.sender === 'ai' && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl rounded-tl-none blur-sm opacity-80 -z-10"></div>
                )}
                {/* Subtle glow for User messages */}
                {message.sender === 'user' && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-2xl rounded-tr-none blur-sm opacity-80 -z-10"></div>
                )}
                
                {message.sender === 'ai' && (
                  <div className="text-xs text-blue-400 font-medium mb-1">HyperBuild</div>
                )}
                <div className="text-sm">{message.content}</div>
                <div className="text-xs mt-1 text-right opacity-60">
                  {formatTime(message.timestamp)}
                </div>
              </div>
              
              {message.sender === 'user' && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-neutral-700 to-neutral-800 ml-2 flex-shrink-0 shadow-lg">
                  <FiUser className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
          
          {isAiTyping && (
            <motion.div 
              className="flex justify-start mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mr-2 flex-shrink-0 shadow-lg">
                <div className="w-6 h-6 bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col">
                  <div className="h-1/5 bg-blue-300"></div>
                  <div className="h-1/5 bg-blue-400"></div>
                  <div className="h-1/5 bg-blue-500"></div>
                  <div className="h-1/5 bg-blue-600"></div>
                  <div className="h-1/5 bg-blue-700"></div>
                </div>
              </div>
              <div className="bg-[#111] rounded-2xl rounded-tl-none px-4 py-3 shadow-md relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl rounded-tl-none blur-sm opacity-70 -z-10"></div>
                <div className="text-xs text-blue-400 font-medium mb-1">HyperBuild</div>
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-gradient-to-b from-[#080808] to-[#0a0a0a] border-t border-[#222] relative z-10">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center bg-[#111] rounded-lg border border-[#333] overflow-hidden focus-within:border-blue-500 transition-all shadow-md">
            <textarea
              ref={inputRef}
              className="flex-1 bg-transparent border-none px-4 py-3 text-white resize-none text-sm focus:outline-none min-h-[44px]"
              placeholder="Describe the app you want to build..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={1}
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="h-full px-4 text-white transition-all flex items-center justify-center relative"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isAiTyping}
            >
              {/* Tło przycisku */}
              
              {/* Ikona */}
              <div className="relative z-10">
                <FiSend className="w-5 h-5 text-white" />
              </div>
            </motion.button>
          </div>
        </div>
        <div className="text-xs text-[#666] mt-2 text-center">
          Press Enter to send, Shift+Enter for a new line
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 