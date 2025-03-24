import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiUser, FiStopCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../services';
import toast from 'react-hot-toast';

// Interfejs dla wiadomości w ramach komponentu
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Interfejs dla API Message
interface ApiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  conversationId: string;
  createdAt: string;
  timestamp?: string;
}

// Rozszerzony interfejs dla odpowiedzi z API
interface GenerateCodeResponse {
  success?: boolean;
  message?: string;
  conversationId?: string;
  explanation?: string;
  files?: Record<string, string>;
  snackUrl?: string;
  executionTime?: number;
  snackError?: { message: string; retryable: boolean } | null;
}

interface ChatInterfaceProps {
  initialPrompt?: string;
  projectId?: string;
  conversationId?: string;
  onSendMessage?: (message: string) => void;
  onCodeGenerated?: (files: Record<string, string>) => void;
  onSnackUrlGenerated?: (url: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  initialPrompt = '',
  projectId,
  conversationId: initialConversationId,
  onSendMessage,
  onCodeGenerated,
  onSnackUrlGenerated
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [promptProcessed, setPromptProcessed] = useState(false);
  const abortControllerRef = useRef<(() => void) | null>(null);
  
  useEffect(() => {
    // Focusuj na polu wprowadzania tekstu po załadowaniu komponentu
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Dodajemy flagę, aby zapobiec wielokrotnemu wywołaniu
  const initialPromptProcessedRef = useRef(false);
  
  useEffect(() => {
    // Sprawdzamy, czy initialPrompt został już przetworzony i czy strona została już załadowana
    if (initialPrompt && initialPrompt.trim() !== '' && !messages.length && !initialPromptProcessedRef.current && !promptProcessed) {
      // Ustawiamy flagi na true, aby zapobiec ponownemu wywołaniu
      initialPromptProcessedRef.current = true;
      setPromptProcessed(true);
      
      // If we have an initial prompt and conversation ID, load that conversation
      if (initialConversationId) {
        loadConversation(initialConversationId);
      } else {
        // Otherwise start with the initial prompt
        const userMessage: Message = {
          id: Date.now().toString(),
          content: initialPrompt,
          sender: 'user',
          timestamp: new Date()
        };
        
        setMessages([userMessage]);
        generateAiResponse(initialPrompt);
      }
      
      // Notify parent component
      onSendMessage?.(initialPrompt);
    }
  }, [initialPrompt, initialConversationId, messages.length, promptProcessed]);

  // Czyszczenie abortController przy odmontowaniu komponentu
  useEffect(() => {
    return () => {
      // Anuluj stream jeśli komponent zostanie odmontowany
      if (abortControllerRef.current) {
        abortControllerRef.current();
      }
    };
  }, []);

  // Load existing conversation if we have an ID
  const loadConversation = async (conversationId: string) => {
    try {
      setIsLoading(true);
      const data = await aiService.getConversation(conversationId);
      
      // Convert API messages to our format
      const formattedMessages = data.messages.map((msg: ApiMessage) => ({
        id: Date.now().toString() + Math.random().toString(),
        content: msg.content,
        sender: msg.role === 'user' ? 'user' : 'ai' as 'user' | 'ai',
        timestamp: new Date(msg.timestamp || msg.createdAt || new Date())
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast.error('Nie udało się załadować konwersacji');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Auto-scroll to the last message
  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping]);
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Utwórz nowy komponent do parsowania odpowiedzi AI
  const parseAiResponse = (response: string): { explanation: string, files: Record<string, string> } => {
    const result: { explanation: string, files: Record<string, string> } = {
      explanation: '',
      files: {}
    };
    
    // Regex dla wykrywania bloków kodu z określonym językiem i ścieżką pliku
    const fileRegex = /FILE_PATH:\s*(.*?)\n```(?:javascript|jsx|js|tsx|ts)?\n([\s\S]*?)\n```/g;
    
    // Próbujemy znaleźć wszystkie pliki
    let match;
    let lastIndex = 0;
    while ((match = fileRegex.exec(response)) !== null) {
      const [fullMatch, filePath, fileContent] = match;
      
      // Jeśli to pierwsze dopasowanie, zapisz tekst przed nim jako wyjaśnienie
      if (lastIndex === 0) {
        result.explanation += response.substring(0, match.index).trim();
      } else {
        // Dodaj tekst między dopasowaniami do wyjaśnienia
        result.explanation += response.substring(lastIndex, match.index).trim();
      }
      
      // Zapisz pozycję końca tego dopasowania
      lastIndex = match.index + fullMatch.length;
      
      // Dodaj plik do kolekcji plików
      const cleanFilePath = filePath.trim().replace(/^\.\//, '');
      result.files[cleanFilePath] = fileContent;
    }
    
    // Dodaj pozostały tekst po ostatnim dopasowaniu (lub cały tekst, jeśli nie było dopasowań)
    if (lastIndex < response.length) {
      result.explanation += response.substring(lastIndex).trim();
    }
    
    return result;
  };
  
  const handleSendMessage = async (content = inputValue) => {
    if (!content.trim() || isAiTyping) return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    
    // Generate real AI response
    generateAiResponse(content);
    
    // Callback
    onSendMessage?.(content);
  };
  
  // Funkcja do zatrzymania odpowiedzi AI
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current();
      abortControllerRef.current = null;
      
      // Dodaj informację w wiadomości, że odpowiedź została przerwana
      setMessages(prev => {
        const updatedMessages = [...prev];
        const lastMessage = updatedMessages[updatedMessages.length - 1];
        
        if (lastMessage && lastMessage.sender === 'ai') {
          updatedMessages[updatedMessages.length - 1] = {
            ...lastMessage,
            content: lastMessage.content + "\n\n[Odpowiedź przerwana przez użytkownika]"
          };
          return updatedMessages;
        }
        return prev;
      });
      
      setIsAiTyping(false);
      toast.success('Generowanie odpowiedzi zostało zatrzymane');
    }
  };
  
  const generateAiResponse = async (userMessage: string) => {
    if (!projectId) {
      toast.error('Brak ID projektu. Nie można wygenerować odpowiedzi.');
      return;
    }
    
    setIsAiTyping(true);
    
    try {
      const requestData = {
        prompt: userMessage,
        projectId,
        conversationId
      };
      
      console.log('Sending AI request:', requestData);
      
      // Dodajemy tymczasową pustą wiadomość AI, która będzie się stopniowo wypełniać
      const tempAiMessageId = Date.now().toString();
      const tempAiMessage: Message = {
        id: tempAiMessageId,
        content: "", // Pusty content na początek
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, tempAiMessage]);

      // Zamiast używać standardowej metody generateCode, używamy wersji ze streamowaniem
      const abortStream = aiService.generateCodeStream(
        requestData,
        {
          // Obsługa każdego chunka - aktualizacja treści wiadomości
          onChunk: (chunk: string) => {
            // Aktualizuj wiadomość o nowy chunk
            setMessages(prev => 
              prev.map(msg => 
                msg.id === tempAiMessageId 
                  ? { ...msg, content: msg.content + chunk } 
                  : msg
              )
            );
            // Scroll do nowej treści
            scrollToBottom();
          },
          
          // Obsługa zakończenia streamu
          onComplete: (response: any) => {
            console.log('Stream completed:', response);
            setIsAiTyping(false);
            
            // Czyścimy referencję do abortController
            abortControllerRef.current = null;
            
            // Zapisz ID konwersacji, jeśli to nasza pierwsza wiadomość
            if (!conversationId && response.conversationId) {
              setConversationId(response.conversationId);
            }
            
            // Przetwórz pliki i wyjaśnienie, jeśli istnieją
            if (response.files && Object.keys(response.files).length > 0) {
              onCodeGenerated?.(response.files);
            }
            
            // Jeśli otrzymaliśmy URL Snacka, przekaż go dalej
            if (response.snackUrl) {
              onSnackUrlGenerated?.(response.snackUrl);
            }
          },
          
          // Obsługa błędów
          onError: (error: Error) => {
            console.error('Stream error:', error);
            setIsAiTyping(false);
            
            // Czyścimy referencję do abortController
            abortControllerRef.current = null;
            
            // Dodaj informację o błędzie do wiadomości
            const errorMessage = `Przepraszam, wystąpił błąd podczas generowania odpowiedzi: ${error.message}`;
            
            setMessages(prev => 
              prev.map(msg => 
                msg.id === tempAiMessageId 
                  ? { ...msg, content: errorMessage } 
                  : msg
              )
            );
            
            toast.error('Błąd podczas generowania odpowiedzi');
          }
        }
      );
      
      // Zapisz funkcję anulowania do późniejszego użycia
      abortControllerRef.current = abortStream;
      
      return () => {
        // Anuluj stream jeśli komponent zostanie odmontowany
        abortStream();
      };
    } catch (error: any) {
      console.error('Error generating AI response:', error);
      
      let errorMessage = 'Nie udało się wygenerować odpowiedzi.';
      
      if (error instanceof Error) {
        errorMessage = `Błąd: ${error.message}`;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = `Błąd: ${JSON.stringify(error)}`;
      }
      
      toast.error(errorMessage);
      
      // Aktualizuj ostatnią wiadomość o informację o błędzie
      setMessages(prev => {
        const updatedMessages = [...prev];
        const lastMessage = updatedMessages[updatedMessages.length - 1];
        
        if (lastMessage && lastMessage.sender === 'ai') {
          updatedMessages[updatedMessages.length - 1] = {
            ...lastMessage,
            content: `Przepraszam, nie mogłem przetworzyć Twojego zapytania. ${errorMessage}. Proszę spróbować ponownie.`
          };
          return updatedMessages;
        } else {
          // Jeśli ostatnia wiadomość nie jest od AI, dodaj nową
          return [...prev, {
            id: Date.now().toString(),
            content: `Przepraszam, nie mogłem przetworzyć Twojego zapytania. ${errorMessage}. Proszę spróbować ponownie.`,
            sender: 'ai',
            timestamp: new Date()
          }];
        }
      });
      
      // Czyścimy referencję do abortController
      abortControllerRef.current = null;
    } finally {
      // setIsAiTyping(false); // Ten stan jest teraz ustawiany w callbackach
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Automatyczne dostosowanie wysokości pola tekstowego
  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setInputValue(textarea.value);
    
    // Reset height to inherit before adjusting to scroll height
    textarea.style.height = 'inherit';
    
    // Add extra space to prevent scrollbar from appearing unnecessarily
    const extraSpace = 2;
    const newHeight = Math.min(textarea.scrollHeight + extraSpace, 200); // limit max height
    textarea.style.height = `${newHeight}px`;
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
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-neutral-400">Ładowanie konwersacji...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-center">
            <div className="max-w-md">
              <h3 className="text-xl font-medium text-white mb-2">Rozpocznij konwersację</h3>
              <p className="text-neutral-400">Napisz wiadomość, aby rozpocząć czat z AI.</p>
            </div>
          </div>
        ) : (
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
                  <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>
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
                  <div className="flex space-x-1.5 items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    
                    {/* Stop button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleStopGeneration}
                      className="ml-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full p-1 transition-colors"
                      title="Zatrzymaj generowanie"
                    >
                      <FiStopCircle className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-gradient-to-b from-[#080808] to-[#0a0a0a] border-t border-[#222] relative z-10">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center bg-[#111] rounded-lg border border-[#333] overflow-hidden focus-within:border-blue-500 transition-all shadow-md">
            <textarea
              ref={inputRef}
              className="flex-1 bg-transparent border-none px-4 py-3 text-white resize-none text-sm focus:outline-none min-h-[44px] max-h-[200px] overflow-y-auto"
              placeholder="Opisz aplikację, którą chcesz zbudować..."
              value={inputValue}
              onChange={adjustTextareaHeight}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className={`h-full px-4 text-white transition-all flex items-center justify-center relative ${
                !inputValue.trim() || isAiTyping ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isAiTyping}
            >
              {/* Ikona */}
              <div className="relative z-10">
                <FiSend className="w-5 h-5 text-white" />
              </div>
            </motion.button>
          </div>
        </div>
        <div className="text-xs text-[#666] mt-2 text-center">
          Naciśnij Enter, aby wysłać, Shift+Enter dla nowej linii
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 