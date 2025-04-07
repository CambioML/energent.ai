import { create } from 'zustand';
import { ChatAPI } from '../api/chat-api';
import { AgentStatus, useAgentStore } from './useAgentStore';
import toast from 'react-hot-toast';

const UPDATED_MESSAGE_ID = 'UPDATED_MESSAGE_ID';

export interface Message {
  id: string;
  content: string;
  isBot: boolean;
  isPartial?: boolean;
  timestamp: number;
  conversationId: string;
  references?: unknown[];
  feedback?: 'good' | 'bad';
}

export interface Conversation {
  id: string;
  summary: string;
  timestamp: number;
}

// API response interfaces
export interface ConversationResponse {
  ConversationId: string;
  Summary: string;
  CreatedAt: number;
}

export interface MessageResponse {
  MessageId: string;
  Content: string;
  Role: string;
  Timestamp: number;
  References?: unknown[];
}

interface ChatState {
  // State
  conversations: Conversation[];
  currentConversationId: string | null;
  messages: Message[];
  isTyping: boolean;
  isGenerating: boolean;
  messagesLoaded: boolean;

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversationId: (id: string | null) => void;
  addMessage: (message: Message) => void;
  editMessage: (id: string, content: string) => Promise<void>;
  
  // API Actions
  fetchConversations: () => Promise<void>;
  fetchConversation: (conversationId: string) => Promise<boolean>;
  fetchConversationWithoutUpdate: (conversationId: string) => Promise<Message[]>;
  createConversation: (summary?: string, projectId?: string, agentId?: string) => Promise<string>;
  deleteConversation: (conversationId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  sendFeedback: (messageId: string, feedback: 'good' | 'bad') => Promise<void>;
  
  // Helper function
  streamAndProcessResponse: (messageId: string, conversationId: string, projectId: string, agentId: string) => Promise<boolean>;
  getUpdatedMessageIdAndMessages: () => Promise<[string, Message[]]>;
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
  editMessage: async (id, content) => {
    let messages = get().messages;

    const { projectId, agentId } = useAgentStore.getState();
    const { currentConversationId, streamAndProcessResponse, getUpdatedMessageIdAndMessages } = get();
    
    if (!currentConversationId || !projectId || !agentId) {
      toast.error('Missing required information');
      return;
    }
    
    if (id === UPDATED_MESSAGE_ID) {
      [id, messages] = await getUpdatedMessageIdAndMessages();
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
      if (content) {
        // Create updated message with new ID
        const updatedMessage: Message = {
          ...messageToUpdate,
          content,
          id: UPDATED_MESSAGE_ID, // New ID for the updated message
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
        
        // Process streaming response
        streamAndProcessResponse(messageId, currentConversationId, projectId, agentId);
        set({ isTyping: true })
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
      const conversations = data.result.map((conv: ConversationResponse) => ({
        id: conv.ConversationId,
        summary: conv.Summary || 'Unnamed Conversation',
        timestamp: conv.CreatedAt || Date.now(),
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
      console.error('from fetchConversation', projectId, agentId);
      throw new Error('Project ID or Agent ID not set');
    }
    
    try {
      const data = await ChatAPI.getConversation(conversationId, projectId, agentId);
      const messages = data.result.history.map((msg: MessageResponse) => ({
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

  fetchConversationWithoutUpdate: async (conversationId) => {
    const { projectId, agentId } = useAgentStore.getState();
    
    if (!projectId || !agentId) {
      toast.error('Project ID or Agent ID not set');
      console.error('from fetchConversation', projectId, agentId);
      throw new Error('Project ID or Agent ID not set');
    }
    
    try {
      const data = await ChatAPI.getConversation(conversationId, projectId, agentId);
      const messages = data.result.history.map((msg: MessageResponse) => ({
        id: msg.MessageId,
        content: msg.Content,
        isBot: msg.Role === 'AI',
        timestamp: msg.Timestamp,
        conversationId,
        references: msg.References || [],
      }));
      return messages;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      toast.error('Failed to load conversation history');
      return [];
    }
  },
  
  createConversation: async (summary = 'New Task', projectIdParam?: string, agentIdParam?: string) => {
    const { fetchConversations, setCurrentConversationId } = get();
    const { projectId: storeProjectId, agentId: storeAgentId } = useAgentStore.getState();
    
    const projectId = projectIdParam || storeProjectId;
    const agentId = agentIdParam || storeAgentId;
    
    if (!projectId || !agentId) {
      toast.error('Project ID or Agent ID not set');
      console.error('from createConversation', projectId, agentId);
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
      console.error('from deleteConversation', projectId, agentId);
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
      
        set({ isGenerating: false });
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
    
    set({ isTyping: false });
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
    const { currentConversationId } = get();
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
      
      // Update the message state with feedback
      set((state) => {
        const updatedMessages = [...state.messages];
        const messageIndex = updatedMessages.findIndex(msg => msg.id === messageId);
        
        if (messageIndex !== -1) {
          updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            feedback
          };
        }
        
        return { messages: updatedMessages };
      });
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast.error('Failed to send feedback');
      throw error;
    }
  },

  getUpdatedMessageIdAndMessages: async () => {
    const { messages, currentConversationId } = get();

    // First, find the message with our placeholder ID
    let message = messages.find(msg => msg.id === UPDATED_MESSAGE_ID) as Message;
    const content = message.content;
    
    // Now get the updated messages after the fetch has completed
    const newMessages = await get().fetchConversationWithoutUpdate(currentConversationId as string);
    
    // Find the message with matching content to get its real ID
    message = newMessages.find(msg => msg.content === content) as Message;

    // Retry up to 2 times with 2 second delay if message not found
    let retryCount = 0;
    const maxRetries = 2;
    while (!message && retryCount < maxRetries) {
      // Wait for 2 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Fetch messages again
      const retryMessages = await get().fetchConversationWithoutUpdate(currentConversationId as string);
      
      // Try to find the message again
      message = retryMessages.find(msg => msg.content === content) as Message;
      retryCount++;
    }

    if (!message) {
      throw new Error('Message not found after retries');
    }

    return [message.id, newMessages];
  } 
})); 