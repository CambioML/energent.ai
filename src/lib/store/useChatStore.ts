import { create } from 'zustand';
import { ChatAPI } from '../api/chat-api';
import { AgentStatus, useAgentStore } from './useAgentStore';
import toast from 'react-hot-toast';

export interface Message {
  id: string;
  content: string;
  isBot: boolean;
  isPartial?: boolean;
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
  isGenerating: boolean;

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
  
  // Helper function to stream and process AI responses
  streamAndProcessResponse: (messageId: string, conversationId: string, projectId: string, agentId: string) => Promise<boolean>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  conversations: [],
  currentConversationId: null,
  messages: [],
  messagesLoaded: false,
  isTyping: false,
  isGenerating: false,
  
  // Basic actions
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversationId: (id) => set({ currentConversationId: id }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  updateMessage: async (id, updates) => {
    const { currentConversationId, messages, streamAndProcessResponse } = get();
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
        set({ isGenerating: false });
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
        // Create updated message with new ID
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

        set({ isTyping: true })
        
        // Send the message to get a new AI response
        const response = await ChatAPI.sendMessage(
          currentConversationId, 
          updatedMessage.content,
          projectId, 
          agentId
        );
        
        const messageId = response.result;
        
        // Process streaming response
        await streamAndProcessResponse(messageId, currentConversationId, projectId, agentId);
      }
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Failed to update message');
      set({ isTyping: false })
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
        const newConversationId = await get().createConversation('New Chat');
        setCurrentConversationId(newConversationId);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error('Failed to delete conversation');
    }
  },
  
  // Helper function to stream and process AI responses
  streamAndProcessResponse: async (messageId: string, conversationId: string, projectId: string, agentId: string) => {
    const { setStatus } = useAgentStore.getState();

    set({ isGenerating: true });
    setStatus(AgentStatus.Running);
    
    while (useChatStore.getState().isGenerating) {
      const streamResponse = await ChatAPI.streamResponse(messageId, projectId, agentId);
      const result = streamResponse.result;
      if (result.completed) {
        // Extract data from the response
        const generatedResult = result.result['Generated Result'];
        const references = result.result.References || [];
        
        // Find if we already have a partial message to update
        const messageExists = get().messages.some(msg => msg.id === messageId);
        
        if (messageExists) {
          // Update existing message to mark it as complete
          set((state) => {
            const updatedMessages = [...state.messages];
            const index = updatedMessages.findIndex(msg => msg.id === messageId);
            if (index !== -1) {
              updatedMessages[index] = {
                ...updatedMessages[index],
                content: generatedResult,
                isPartial: false,
                references: references
              };
            }
            return { messages: updatedMessages };
          });
        } else {
          // Add new complete bot response
          const botMessage: Message = {
            id: messageId,
            content: generatedResult,
            isBot: true,
            isPartial: false,
            timestamp: Date.now(),
            conversationId: conversationId,
            references: references,
          };
          set((state) => ({ 
            messages: [...state.messages, botMessage] 
          }));
        }
      } else if (result.result && result.result['Generated Result']) {
        // Handle uncompleted messages
        const partialContent = result.result['Generated Result'];
        
        set((state) => {
          // Check if message already exists in the state
          const existingMessageIndex = state.messages.findIndex(msg => msg.id === messageId);
          
          if (existingMessageIndex === -1) {
            // Case 1: Message not in messages, add it
            // Not typing a new message, but updating the last one
            set({ isTyping: false });
            const partialMessage: Message = {
              id: messageId,
              content: partialContent,
              isPartial: true,
              isBot: true,
              timestamp: Date.now(),
              conversationId: conversationId,
            };
            return { messages: [...state.messages, partialMessage] };
          } else if (state.messages[existingMessageIndex].content !== partialContent) {
            // Case 3: Message exists and needs update
            const updatedMessages = [...state.messages];
            updatedMessages[existingMessageIndex] = {
              ...updatedMessages[existingMessageIndex],
              content: partialContent,
              timestamp: Date.now()
            };
            return { messages: updatedMessages };
          }
          // Case 2: Message exists but no update needed
          return { messages: state.messages };
        });
      }
      
      // Short delay between polling
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    set({ isTyping: false, isGenerating: false });
    setStatus(AgentStatus.Ready);
    return true;
  },
  
  sendMessage: async (content) => {
    const { currentConversationId, addMessage, streamAndProcessResponse } = get();
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
      // Send message to API
      const response = await ChatAPI.sendMessage(currentConversationId, content, projectId, agentId);
      const messageId = response.result;
      set({ isTyping: true })
      
      // Process streaming response
      await streamAndProcessResponse(messageId, currentConversationId, projectId, agentId);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      set({ isTyping: false, isGenerating: false });
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