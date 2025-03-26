import axios from 'axios';
import { AGENT_ID } from './config';
import { resourcesDomain } from './endpoints';

interface AgentAPI {
    getAgentStatus: () => Promise<{
        message: 'Ready' | 'Loading' | 'Running' | 'Error';
    }>;
    resetAgent: () => Promise<void>;
}

export const AgentAPI: AgentAPI = {
    getAgentStatus: async () => {
        try {
            const response = await axios.get(`${resourcesDomain}/agent/${AGENT_ID}/status`);
            return response.data;
        } catch (error) {
            console.error('Failed to get agent status:', error);
            return { message: 'Error' };
        }
    },
    
    resetAgent: async () => {
        try {
            const response = await axios.post(`${resourcesDomain}/${AGENT_ID}/reset`);
            return response.data;
        } catch (error) {
            console.error('Failed to reset agent:', error);
            throw error;
        }
    }
}