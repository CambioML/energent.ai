import axios from 'axios';
import { AGENT_ID, PROJECT_ID, API_BASE_URL } from './config';
import { getAnonymousToken, getUserInfo } from '../utils/local-storage';

// Define the ChatFeedbackItem interface
export interface ChatFeedbackItem {
  UserId: string;
  ConversationId: string;
  MessageId?: string;
  SearchId?: string;
  Feedback: 'good' | 'bad';
  AdditionalFeedback: string;
  Timestamp?: number;
}

interface SendMessageResponse {
    statusCode: number;
    result: string;
}

interface ChatAPI {
    getConversation: (conversationId: string) => Promise<any>;
    getConversations: () => Promise<any>;
    createConversation: (summary: string) => Promise<any>;
    deleteConversation: (conversationId: string) => Promise<any>;
    editMessage: (conversationId: string, messageId: string, message: string) => Promise<any>;
    sendMessage: (conversationId: string, message: string) => Promise<SendMessageResponse>;
    streamResponse: (messageId: string) => Promise<any>;
    sendFeedback: (conversationId: string, messageId: string, feedback: 'good' | 'bad') => Promise<any>;
}

// Chat API endpoints
export const ChatAPI: ChatAPI = {
  // Get conversation history
  getConversation: async (conversationId: string) => {
    // TODO: Why is this 65536?
    // Without this we get 405 Method Not Allowed
    const response = await axios.get(`${API_BASE_URL}/conversation/${PROJECT_ID}/${AGENT_ID}/${conversationId}/65536`);
    return response.data;
  },

  // Get all conversations
  getConversations: async () => {
    const response = await axios.get(`${API_BASE_URL}/conversations/${PROJECT_ID}/${AGENT_ID}`);
    return response.data;
  },


  // Create a new conversation
  createConversation: async (summary: string = 'New Task') => {
    const payload = {
      summary
    };
      const response = await axios.post(`${API_BASE_URL}/conversation/${PROJECT_ID}/${AGENT_ID}/create`, payload);
    return response.data;
  },

  // Delete a conversation
  deleteConversation: async (conversationId: string) => {
    const response = await axios.delete(`${API_BASE_URL}/conversation/${PROJECT_ID}/${AGENT_ID}/${conversationId}`);
    return response.data;
  },

  // Send message to chat
  sendMessage: async (conversationId: string, message: string) => {
    const payload = { message };
    const response = await axios.post(`${API_BASE_URL}/chat/${PROJECT_ID}/${AGENT_ID}/${conversationId}`, payload);
    return response.data;
  },

  editMessage: async (conversationId: string, messageId: string, message: string) => {
    const payload = { message };
    const response = await axios.put(`${API_BASE_URL}/chat/${PROJECT_ID}/${AGENT_ID}/${conversationId}/${messageId}`, payload);
    return response.data;
  },

  // Stream chat response
  streamResponse: async (messageId: string) => {
    const response = await axios.get(`${API_BASE_URL}/stream/${PROJECT_ID}/${AGENT_ID}/${messageId}`);
    return response.data;
  },

  // Send feedback for a message
  sendFeedback: async (conversationId: string, messageId: string, feedback: 'good' | 'bad') => {
    const currentUser = getUserInfo();
    const payload: ChatFeedbackItem = {
      UserId:
        currentUser?.member_id ||
        currentUser?.user_email ||
        getAnonymousToken() ||
        "unknown",
      ConversationId: conversationId,
      MessageId: messageId,
      Feedback: feedback,
      AdditionalFeedback: "",
      Timestamp: Math.round(Date.now() / 1000),
    };
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/feedback/generation/${PROJECT_ID}/${AGENT_ID}/${conversationId}`, 
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error sending feedback:", error);
      throw error;
    }
  }
}; 