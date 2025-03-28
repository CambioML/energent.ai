import { create } from 'zustand';
import { ChatAPI } from '../api/chat-api';
import { useAgentStore } from './agent';
import toast from 'react-hot-toast';

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
  messagesLoaded: boolean;
  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversationId: (id: string | null) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => Promise<void>;
  
  // API Actions
  fetchConversations: () => Promise<void>;
  fetchConversation: (conversationId: string) => Promise<boolean>;
  createConversation: (summary?: string, projectId?: string, agentId?: string) => Promise<string>;
  deleteConversation: (conversationId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  sendFeedback: (messageId: string, feedback: 'good' | 'bad') => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  conversations: [],
  currentConversationId: null,
  messages: [],
  messagesLoaded: false,
  isTyping: false,
  
  // Basic actions
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversationId: (id) => set({ currentConversationId: id }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  updateMessage: async (id, updates) => {
    const { currentConversationId, messages } = get();
    const { projectId, agentId } = useAgentStore.getState();
    
    if (!currentConversationId || !projectId || !agentId) {
      toast.error('Missing required information');
      return;
    }
    
    try {
      // Find the message to update
      const messageToUpdate = messages.find(msg => msg.id === id);
      
      if (!messageToUpdate) {
        toast.error('Message not found');
        return;
      }
      
      // Find message index to update UI properly
      const messageIndex = messages.findIndex(msg => msg.id === id);
      
      // Delete the message (which will also delete all messages after it)
      await ChatAPI.deleteMessagesStartingFrom(currentConversationId, id, projectId, agentId);
      
      // Update UI immediately to remove the deleted messages
      set((state) => ({
        messages: state.messages.slice(0, messageIndex)
      }));
      
      // Send the updated message content
      if (updates.content) {
        set({ isTyping: true });
        
        // Send the updated message as a new message
        const updatedMessage: Message = {
          ...messageToUpdate,
          ...updates,
          id: Date.now().toString(), // New ID for the updated message
          timestamp: Date.now()
        };
        
        // Add the updated user message to the UI
        set((state) => ({ 
          messages: [...state.messages, updatedMessage] 
        }));
        
        // Send the message to get a new AI response
        const response = await ChatAPI.sendMessage(
          currentConversationId, 
          updatedMessage.content,
          projectId, 
          agentId
        );
        
        const messageId = response.result;
        
        // Poll for streaming response
        let completed = false;
        while (!completed) {
          const streamResponse = await ChatAPI.streamResponse(messageId, projectId, agentId);
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
            set((state) => ({ 
              messages: [...state.messages, botMessage] 
            }));
          }
          
          // Short delay between polling
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        set({ isTyping: false });
      }
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Failed to update message');
    }
  },
  
  // API actions
  fetchConversations: async () => {
    const { setConversations, setCurrentConversationId, createConversation } = get();
    const { projectId, agentId } = useAgentStore.getState();
    
    try {
      console.log('Fetching conversations for projectId:', projectId, 'and agentId:', agentId);
      const data = await ChatAPI.getConversations(projectId, agentId);
      const conversations = data.result.map((conv: any) => ({
        id: conv.conversationId || conv.ConversationId,
        summary: conv.summary || conv.Summary || 'Unnamed Conversation',
        timestamp: conv.timestamp || conv.CreatedAt || Date.now(),
      }));
      
      setConversations(conversations);
      
      // If no conversations are available, create a new one
      if (conversations.length === 0) {
        console.log('No conversations found, creating a new one');
        const newConversationId = await createConversation('New Chat');
        setCurrentConversationId(newConversationId);
        return conversations;
      } else {
        setCurrentConversationId(conversations[0]?.id || null);
      }
      
      return conversations;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
      return [];
    }
  },
  
  fetchConversation: async (conversationId) => {
    const { projectId, agentId } = useAgentStore.getState();
    
    if (!projectId || !agentId) {
      toast.error('Project ID or Agent ID not set');
      throw new Error('Project ID or Agent ID not set');
    }
    
    try {
      const data = await ChatAPI.getConversation(conversationId, projectId, agentId);
      const messages = data.result.history.map((msg: any) => ({
        id: msg.MessageId,
        content: msg.Content,
        isBot: msg.Role === 'AI',
        timestamp: msg.Timestamp,
        conversationId,
        references: msg.References || [],
      }));
      set({ messages, messagesLoaded: true });
      return true;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      toast.error('Failed to load conversation history');
      return false;
    }
  },
  
  createConversation: async (summary = 'New Task', projectIdParam?: string, agentIdParam?: string) => {
    const { fetchConversations, setCurrentConversationId } = get();
    const { projectId: storeProjectId, agentId: storeAgentId } = useAgentStore.getState();
    
    const projectId = projectIdParam || storeProjectId;
    const agentId = agentIdParam || storeAgentId;
    
    if (!projectId || !agentId) {
      toast.error('Project ID or Agent ID not set');
      throw new Error('Project ID or Agent ID not set');
    }
    
    try {
      const data = await ChatAPI.createConversation(summary, projectId, agentId);
      const conversationId = data.result.conversationId;

      await fetchConversations();
      setCurrentConversationId(conversationId);

      return conversationId;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to create new conversation');
      throw error;
    }
  },
  
  deleteConversation: async (conversationId) => {
    const { fetchConversations, currentConversationId, setCurrentConversationId } = get();
    const { projectId, agentId } = useAgentStore.getState();
    
    if (!projectId || !agentId) {
      toast.error('Project ID or Agent ID not set');
      throw new Error('Project ID or Agent ID not set');
    }
    
    try {
      await ChatAPI.deleteConversation(conversationId, projectId, agentId);
      await fetchConversations();
      
      // Reset current conversation if we deleted the active one
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error('Failed to delete conversation');
    }
  },
  
  sendMessage: async (content) => {
    const { currentConversationId, addMessage } = get();
    const { projectId, agentId } = useAgentStore.getState();
    
    if (!projectId || !agentId) {
      toast.error('Project ID or Agent ID not set');
      throw new Error('Project ID or Agent ID not set');
    }
    
    if (!currentConversationId) {
      toast.error('No active conversation');
      throw new Error('No active conversation');
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
      set({ isTyping: true });
      
      // Send message to API
      const response = await ChatAPI.sendMessage(currentConversationId, content, projectId, agentId);
      const messageId = response.result;
      
      // Poll for streaming response
      let completed = false;
      while (!completed) {
        const streamResponse = await ChatAPI.streamResponse(messageId, projectId, agentId);
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
      toast.error('Failed to send message');
    } finally {
      set({ isTyping: false });
    }
  },
  
  sendFeedback: async (messageId, feedback) => {
    const { currentConversationId, updateMessage } = get();
    const { projectId, agentId } = useAgentStore.getState();
    
    if (!projectId || !agentId) {
      toast.error('Project ID or Agent ID not set');
      throw new Error('Project ID or Agent ID not set');
    }
    
    if (!currentConversationId) {
      toast.error('No active conversation');
      throw new Error('No active conversation');
    }
    
    try {
      await ChatAPI.sendFeedback(currentConversationId, messageId, feedback, projectId, agentId);
      updateMessage(messageId, { feedback });
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast.error('Failed to send feedback');
    }
  },
})); 