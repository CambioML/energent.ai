import { create } from 'zustand';
import { ChatAPI } from '../api/chat-api';

export interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: number;
  conversationId: string;
  references?: any[];
  feedback?: 'good' | 'bad';
}

export interface Conversation {
  id: string;
  summary: string;
  timestamp: number;
}

interface ChatState {
  // State
  conversations: Conversation[];
  currentConversationId: string | null;
  messages: Message[];
  isTyping: boolean;
  error: string | null;
  
  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversationId: (id: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  setIsTyping: (isTyping: boolean) => void;
  setError: (error: string | null) => void;
  
  // API Actions
  fetchConversations: () => Promise<void>;
  fetchConversation: (conversationId: string) => Promise<void>;
  createConversation: (summary?: string) => Promise<string>;
  deleteConversation: (conversationId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  sendFeedback: (messageId: string, feedback: 'good' | 'bad') => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  conversations: [],
  currentConversationId: null,
  messages: [],
  isTyping: false,
  error: null,
  
  // Basic actions
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversationId: (id) => set({ currentConversationId: id }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  updateMessage: (id, updates) => set((state) => ({
    messages: state.messages.map(msg => 
      msg.id === id ? { ...msg, ...updates } : msg
    )
  })),
  setIsTyping: (isTyping) => set({ isTyping }),
  setError: (error) => set({ error }),
  
  // API actions
  fetchConversations: async () => {
    const { setError, setConversations, setCurrentConversationId } = get();
    setError(null);
    try {
      const data = await ChatAPI.getConversations();
      const conversations = data.result.map((conv: any) => ({
        id: conv.conversationId || conv.ConversationId,
        summary: conv.summary || conv.Summary || 'Unnamed Conversation',
        timestamp: conv.timestamp || conv.CreatedAt || Date.now(),
      }));
      setConversations(conversations);
      setCurrentConversationId(conversations[0].id);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Failed to load conversations');
    }
  },
  
  fetchConversation: async (conversationId) => {
    const { setMessages, setError } = get();
    setError(null);
    try {
      const data = await ChatAPI.getConversation(conversationId);
      const messages = data.result.history.map((msg: any) => ({
        id: msg.MessageId,
        content: msg.Content,
        isBot: msg.Role === 'AI',
        timestamp: msg.Timestamp,
        conversationId,
        references: msg.References || [],
      }));
      setMessages(messages);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      setError('Failed to load conversation history');
    }
  },
  
  createConversation: async (summary = 'New Task') => {
    const { setError, fetchConversations, setCurrentConversationId } = get();
    setError(null);
    try {
      const data = await ChatAPI.createConversation(summary);
      const conversationId = data.result.conversationId;

      await fetchConversations();
      setCurrentConversationId(conversationId);

      return conversationId;
    } catch (error) {
      console.error('Error creating conversation:', error);
      setError('Failed to create new conversation');
      throw error;
    }
  },
  
  deleteConversation: async (conversationId) => {
    const { setError, fetchConversations, currentConversationId, setCurrentConversationId } = get();
    setError(null);
    try {
      await ChatAPI.deleteConversation(conversationId);
      await fetchConversations();
      
      // Reset current conversation if we deleted the active one
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      setError('Failed to delete conversation');
    }
  },
  
  sendMessage: async (content) => {
    const { currentConversationId, addMessage, setIsTyping, setError } = get();
    
    if (!currentConversationId) {
      setError('No active conversation');
      return;
    }
    
    // Add user message to UI immediately
    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      content,
      isBot: false,
      timestamp: Date.now(),
      conversationId: currentConversationId,
    };
    addMessage(userMessage);
    
    try {
      setIsTyping(true);
      
      // Send message to API
      const response = await ChatAPI.sendMessage(currentConversationId, content);
      const messageId = response.result;
      
      // Poll for streaming response
      let completed = false;
      while (!completed) {
        const streamResponse = await ChatAPI.streamResponse(messageId);
        const result = streamResponse.result;
        
        if (result.completed) {
          completed = true;
          
          // Extract data from the response
          const generatedResult = result.result['Generated Result'];
          const references = result.result.References || [];
          
          // Add bot response
          const botMessage: Message = {
            id: messageId,
            content: generatedResult,
            isBot: true,
            timestamp: Date.now(),
            conversationId: currentConversationId,
            references: references,
          };
          addMessage(botMessage);
        }
        
        // Short delay between polling
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    } finally {
      setIsTyping(false);
    }
  },
  
  sendFeedback: async (messageId, feedback) => {
    const { currentConversationId, updateMessage, setError } = get();
    
    if (!currentConversationId) {
      setError('No active conversation');
      return;
    }
    
    try {
      await ChatAPI.sendFeedback(currentConversationId, messageId, feedback);
      updateMessage(messageId, { feedback });
    } catch (error) {
      console.error('Error sending feedback:', error);
      setError('Failed to send feedback');
    }
  },
})); 