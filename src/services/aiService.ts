import api from './api';

interface Conversation {
  id: string;
  title: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  conversationId: string;
  createdAt: string;
}

interface GenerateCodeRequest {
  prompt: string;
  projectId?: string;
  conversationId?: string;
  mode?: 'create' | 'modify' | 'explain';
}

interface GenerateCodeResponse {
  code?: string;
  message?: string;
  explanation?: string;
  conversationId: string;
  messageId?: string;
  files?: Record<string, string>;
  snackUrl?: string;
  executionTime?: number;
  snackError?: { message: string; retryable: boolean } | null;
  success?: boolean;
}

// Nowy interfejs dla callbacków streamu
interface StreamCallbacks {
  onChunk: (chunk: string) => void;
  onComplete: (response: GenerateCodeResponse) => void;
  onError: (error: Error) => void;
}

interface CreateConversationRequest {
  title: string;
  projectId: string;
  initialMessage?: string;
}

/**
 * AI service for code generation and conversations
 */
const aiService = {
  /**
   * Generate code based on a prompt
   */
  async generateCode(request: GenerateCodeRequest): Promise<GenerateCodeResponse> {
    // Uwaga: w backendzie trasy AI są montowane jako '/api/generate'
    try {
      console.log('Sending AI request to endpoint: /generate');
      const response = await api.post<GenerateCodeResponse>('/generate', request);
      return response.data;
    } catch (error: any) {
      console.error('Error calling AI service:', error);
      
      // Sprawdźmy dokładniej, jaki błąd otrzymujemy
      let errorDetails = '';
      if (error.response) {
        errorDetails = `Status: ${error.response.status}, Message: ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        errorDetails = 'No response received from server';
      } else {
        errorDetails = error.message || 'Unknown error';
      }
      console.error('Detailed error:', errorDetails);
      
      // Tymczasowa odpowiedź w przypadku błędu API
      return {
        conversationId: request.conversationId || `error_${Date.now()}`,
        explanation: `# Błąd połączenia z API\n\nNie można połączyć się z usługą AI. Sprawdź połączenie internetowe lub skontaktuj się z administratorem.\n\nOtrzymane zapytanie: "${request.prompt}"\n\nSzczegóły błędu: ${errorDetails}`,
        success: false,
        files: {},
        executionTime: 0
      };
    }
  },

  /**
   * Generate code with streaming response
   * Uses Server-Sent Events for real-time chunks
   */
  generateCodeStream(request: GenerateCodeRequest, callbacks: StreamCallbacks): () => void {
    console.log('Starting streaming AI request to endpoint: /generate/stream');
    
    // Pobierz token autoryzacyjny z localStorage
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Tworzymy URL dla EventSource z parametrami
    const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000/api';
    const url = new URL(`${API_URL}/generate/stream`);
    
    // EventSource nie obsługuje metody POST, dlatego użyjemy fetch
    // z opcją streamowania lub własnej implementacji EventSource
    let responseData: GenerateCodeResponse = {
      conversationId: request.conversationId || `stream_${Date.now()}`,
      explanation: '',
      success: true
    };
    
    let chunks: string[] = [];
    
    // Używamy fetch z obsługą streamowania
    const abortController = new AbortController();
    
    fetch(`${API_URL}/generate/stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
      signal: abortController.signal
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
      }
      if (!response.body) {
        throw new Error('ReadableStream not supported');
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      function readStream() {
        reader.read().then(({ done, value }) => {
          if (done) {
            // Zakończono stream, ustalamy pełną odpowiedź
            responseData.explanation = chunks.join('');
            callbacks.onComplete(responseData);
            return;
          }
          
          // Dekodujemy i przetwarzamy chunk
          const chunk = decoder.decode(value, { stream: true });
          
          try {
            // Próbujemy sparsować JSON, jeśli to możliwe
            // Format: data: {"type":"content_block_delta","delta":"tekst"}
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data:')) {
                try {
                  const jsonData = JSON.parse(line.substring(5).trim());
                  
                  // Obsługa różnych typów wiadomości
                  if (jsonData.type === 'content_block_delta' && jsonData.delta) {
                    chunks.push(jsonData.delta);
                    callbacks.onChunk(jsonData.delta);
                  } else if (jsonData.conversationId) {
                    responseData.conversationId = jsonData.conversationId;
                  }
                  
                  // Dodatkowe pola, które mogą być w odpowiedzi
                  if (jsonData.files) {
                    responseData.files = jsonData.files;
                  }
                  if (jsonData.snackUrl) {
                    responseData.snackUrl = jsonData.snackUrl;
                  }
                } catch (e) {
                  // Jeśli to nie jest prawidłowy JSON, traktujemy jako zwykły tekst
                  chunks.push(line.substring(5).trim());
                  callbacks.onChunk(line.substring(5).trim());
                }
              } else if (line.trim() !== '') {
                // Obsługa zwykłego tekstu
                chunks.push(line);
                callbacks.onChunk(line);
              }
            }
          } catch (e) {
            console.error('Error parsing stream chunk:', e);
            // Nawet jeśli jest błąd parsowania, dodajemy chunk jako tekst
            chunks.push(chunk);
            callbacks.onChunk(chunk);
          }
          
          // Kontynuujemy odczyt
          readStream();
        }).catch(error => {
          console.error('Error reading stream:', error);
          callbacks.onError(error);
        });
      }
      
      // Rozpoczynamy odczyt
      readStream();
    })
    .catch(error => {
      console.error('Fetch error:', error);
      callbacks.onError(error);
    });
    
    // Zwracamy funkcję do anulowania streamu
    return () => {
      abortController.abort();
    };
  },

  /**
   * Get all conversations for a project
   */
  async getConversations(projectId: string): Promise<Conversation[]> {
    try {
      const response = await api.get<Conversation[]>(`/generate/conversations/${projectId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  },

  /**
   * Get a single conversation with messages
   */
  async getConversation(conversationId: string): Promise<{ conversation: Conversation; messages: Message[] }> {
    try {
      const response = await api.get<{ conversation: Conversation; messages: Message[] }>(
        `/generate/conversation/${conversationId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching conversation:', error);
      
      // Tymczasowa odpowiedź w przypadku błędu API
      const mockConversation: Conversation = {
        id: conversationId,
        title: 'Conversation',
        projectId: 'unknown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return {
        conversation: mockConversation,
        messages: []
      };
    }
  },

  /**
   * Create a new conversation
   */
  async createConversation(data: CreateConversationRequest): Promise<Conversation> {
    try {
      const response = await api.post<Conversation>('/generate/conversation', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      
      // Tymczasowa odpowiedź w przypadku błędu API
      return {
        id: `error_${Date.now()}`,
        title: data.title,
        projectId: data.projectId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  }
};

export default aiService; 