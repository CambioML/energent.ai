import axios from 'axios';

// API base URL - Configure according to your environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.energent.ai';

// Chat API endpoints
export const ChatAPI = {
  // Get conversation history
  getConversation: async (conversationId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/conversation/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  },

  // Get all conversations
  getConversations: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/conversations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  // Create a new conversation
  createConversation: async (summary: string = 'New Task') => {
    try {
      const payload = {
        summary
      };
      const response = await axios.post(`${API_BASE_URL}/conversation/create`, payload);
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  // Delete a conversation
  deleteConversation: async (conversationId: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/conversation/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },

  // Send message to chat
  sendMessage: async (conversationId: string, message: string, file?: File) => {
    try {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('message', message);
        
        const response = await axios.post(`${API_BASE_URL}/chat/${conversationId}/with-file`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } else {
        const payload = { message };
        const response = await axios.post(`${API_BASE_URL}/chat/${conversationId}`, payload);
        return response.data;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Stream chat response
  streamResponse: async (messageId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stream/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error streaming response:', error);
      throw error;
    }
  },

  // Send feedback for a message
  sendFeedback: async (conversationId: string, messageId: string, feedback: 'positive' | 'negative', additionalFeedback?: string) => {
    try {
      const payload = {
        feedback,
        additionalFeedback: additionalFeedback || '',
        timestamp: Math.round(Date.now() / 1000),
      };
      const response = await axios.post(`${API_BASE_URL}/feedback/${conversationId}/${messageId}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error sending feedback:', error);
      throw error;
    }
  }
}; 