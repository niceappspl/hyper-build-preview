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
  code: string;
  message: string;
  conversationId: string;
  messageId: string;
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
    const response = await api.post<GenerateCodeResponse>('/ai', request);
    return response.data;
  },

  /**
   * Get all conversations for a project
   */
  async getConversations(projectId: string): Promise<Conversation[]> {
    const response = await api.get<Conversation[]>(`/ai/conversations/${projectId}`);
    return response.data;
  },

  /**
   * Get a single conversation with messages
   */
  async getConversation(conversationId: string): Promise<{ conversation: Conversation; messages: Message[] }> {
    const response = await api.get<{ conversation: Conversation; messages: Message[] }>(
      `/ai/conversation/${conversationId}`
    );
    return response.data;
  },

  /**
   * Create a new conversation
   */
  async createConversation(data: CreateConversationRequest): Promise<Conversation> {
    const response = await api.post<Conversation>('/ai/conversation', data);
    return response.data;
  }
};

export default aiService; 