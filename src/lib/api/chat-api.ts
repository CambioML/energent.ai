import axios from 'axios';
import { getAnonymousToken, getUserInfo } from '../utils/local-storage';
import { Endpoint } from './endpoints';

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

interface FileUploadResponse {
    success: boolean;
    message: string;
    file_id?: string;
}

interface Organization {
  org_id: string;
  name: string;
  root_resource_id?: string;
  configs?: {
    apps_enabled?: string;
    plan?: string;
  };
}

interface ChatAPI {
    getConversation: (conversationId: string, projectId: string, agentId: string) => Promise<any>;
    getConversations: (projectId: string, agentId: string) => Promise<any>;
    createConversation: (summary: string, projectId: string, agentId: string) => Promise<any>;
    deleteConversation: (conversationId: string, projectId: string, agentId: string) => Promise<any>;
    editMessage: (conversationId: string, messageId: string, message: string, projectId: string, agentId: string) => Promise<any>;
    sendMessage: (conversationId: string, message: string, projectId: string, agentId: string) => Promise<SendMessageResponse>;
    streamResponse: (messageId: string, projectId: string, agentId: string) => Promise<any>;
    sendFeedback: (conversationId: string, messageId: string, feedback: 'good' | 'bad', projectId: string, agentId: string) => Promise<any>;
    deleteMessagesStartingFrom: (conversationId: string, messageId: string, projectId: string, agentId: string) => Promise<any>;
    uploadFile: (file: File, agentId: string) => Promise<FileUploadResponse>;
    listOrganizations: () => Promise<Organization[]>;
    createOrganization: (name: string) => Promise<Organization>;
}

// Chat API endpoints
export const ChatAPI: ChatAPI = {
  // Get conversation history
  getConversation: async (conversationId: string, projectId: string, agentId: string) => {
    // TODO: Why is this 65536?
    // Without this we get 405 Method Not Allowed
    const response = await axios.get(`${Endpoint.chatbotApp}/conversation/${projectId}/${agentId}/${conversationId}/65536`);
    return response.data;
  },

  // Get all conversations
  getConversations: async (projectId: string, agentId: string) => {
    const response = await axios.get(`${Endpoint.chatbotApp}/conversations/${projectId}/${agentId}`);
    return response.data;
  },


  // Create a new conversation
  createConversation: async (summary: string = 'New Task', projectId: string, agentId: string) => {
    const payload = {
      summary
    };
    const response = await axios.post(`${Endpoint.chatbotApp}/conversation/${projectId}/${agentId}/create`, payload);
    return response.data;
  },

  // Delete a conversation
  deleteConversation: async (conversationId: string, projectId: string, agentId: string) => {
    const response = await axios.delete(`${Endpoint.chatbotApp}/conversation/${projectId}/${agentId}/${conversationId}`);
    return response.data;
  },

  // Send message to chat
  sendMessage: async (conversationId: string, message: string, projectId: string, agentId: string) => {
    const payload = { message };
    const response = await axios.post(`${Endpoint.chatbotApp}/chat/${projectId}/${agentId}/${conversationId}`, payload);
    return response.data;
  },

  editMessage: async (conversationId: string, messageId: string, message: string, projectId: string, agentId: string) => {
    const payload = { message };
    const response = await axios.put(`${Endpoint.chatbotApp}/chat/${projectId}/${agentId}/${conversationId}/${messageId}`, payload);
    return response.data;
  },

  // Stream chat response
  streamResponse: async (messageId: string, projectId: string, agentId: string) => {
    const response = await axios.get(`${Endpoint.chatbotApp}/stream/${projectId}/${agentId}/${messageId}`);
    return response.data;
  },

  // Send feedback for a message
  sendFeedback: async (conversationId: string, messageId: string, feedback: 'good' | 'bad', projectId: string, agentId: string) => {
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
        `${Endpoint.chatbotApp}/feedback/generation/${projectId}/${agentId}/${conversationId}`, 
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error sending feedback:", error);
      throw error;
    }
  },

  // Delete a message and all messages after it
  deleteMessagesStartingFrom: async (conversationId: string, messageId: string, projectId: string, agentId: string) => {
    const response = await axios.delete(`${Endpoint.chatbotApp}/chat/${projectId}/${agentId}/${conversationId}/${messageId}`);
    return response.data;
  },

  // Upload a file
  uploadFile: async (file: File, agentId: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file, file.name);
      
      const response = await axios.put(
        `${Endpoint.agent}/${agentId}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'accept': 'application/json'
          }
        }
      );
      
      return {
        success: true,
        message: 'File uploaded successfully',
        file_id: response.data?.file_id
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to upload file'
      };
    }
  },

  // List all organizations for the current user
  listOrganizations: async () => {
    try {
      const response = await axios.get(Endpoint.memberOrgs);
      return response.data;
    } catch (error) {
      console.error("Error listing organizations:", error);
      throw error;
    }
  },

  // Create a new organization
  createOrganization: async (name: string) => {
    try {
      const payload = { name };
      const response = await axios.post(Endpoint.orgs, payload);
      return response.data;
    } catch (error) {
      console.error("Error creating organization:", error);
      throw error;
    }
  },
}; 