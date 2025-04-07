import axios from 'axios';
import { resourcesDomain, Endpoint } from './endpoints';
import { getDefaultAgentConfig, getUpdateSystemPromptConfig } from '../utils/agent-config';
import { getUserInfo } from '../utils/local-storage';
import { ChatAPI } from './chat-api';
import { useAgentStore } from '../store/useAgentStore';
import { RAGAppConfig } from '../utils/app-config/model';

interface AgentAPI {
    getAgentStatus: (agentId: string) => Promise<{
        message: 'Ready' | 'Starting' | 'Running' | 'Error';
    }>;
    getProjectId: () => Promise<string>;
    createAgent: (projectId: string) => Promise<string>;
    getAgentId: (projectId: string) => Promise<string | null>;
    stopAgent: (projectId: string, agentId: string, messageId: string) => Promise<void>;
    restartAgent: (agentId: string) => Promise<void>;
    updateSystemPrompt: (systemPrompt: string) => Promise<void>;
    startVideoRecording: (agentId: string, conversationId: string) => Promise<{success: boolean}>;
    stopVideoRecording: (agentId: string, conversationId: string) => Promise<{success: boolean}>;
    getCurrentBotConfig: () => Promise<RAGAppConfig>;
    getSystemPrompt: () => Promise<string>;
}

export const AgentAPI: AgentAPI = {
    getAgentStatus: async (agentId: string) => {
        try {
            const response = await axios.get(`${resourcesDomain}/agent/${agentId}/status`);
            switch (response.data.message) {
                case 'NotReady':
                case 'Loading':
                    return { message: 'Starting' };
                default:
                    return response.data;
            }
        } catch (error) {
            console.error('Failed to get agent status:', error);
            return { message: 'Error' };
        }
    },
    
    getProjectId: async () => {
        try {
            // Step 1: Get organizations to find root resource ID
            const orgsResponse = await axios.get(Endpoint.orgs + '/my-orgs');
            const organizations = orgsResponse.data;
            
            // Check if organizations is empty
            if (!organizations || organizations.length === 0) {
                console.log('No organizations found, creating a new one');
                
                // Create a new organization using the email or a default name
                const userInfo = getUserInfo();
                const orgName = userInfo?.user_email ? 
                    userInfo.user_email.split('@')[0].replace(/\s+/g, ' ').replace(' ', '-') + '-org' : 
                    `org-${Date.now()}`;
                
                // Create the organization using the ChatAPI
                const newOrg = await ChatAPI.createOrganization(orgName);
                
                console.log('Created new organization:', newOrg);
                
                // Store org info in localStorage
                if (newOrg.root_resource_id) {
                    // Create a default project
                    const projectResponse = await axios.post(`${resourcesDomain}/projects`, {
                        name: 'Default Project',
                        parent_resource_id: newOrg.root_resource_id,
                        description: ""
                    });
                    
                    const projectId = projectResponse.data.resource_id;
                    console.log('Created default project:', projectId);
                    
                    return projectId;
                } else {
                    throw new Error('Failed to get root resource ID from created organization');
                }
            }
            
            const rootResourceId = organizations[0].root_resource_id;
            console.log('Root resource ID:', rootResourceId);
            
            // Step 2: List projects using the root resource ID
            const projectsResponse = await axios.get(`${resourcesDomain}/projects/${rootResourceId}/list`);
            const projects = projectsResponse.data;
            
            // Check if projects is empty
            if (!projects || projects.length === 0) {
                console.log('No projects found, creating a default project');
                
                // Create a default project
                const projectResponse = await axios.post(`${resourcesDomain}/projects`, {
                    name: 'Default Project',
                    parent_resource_id: rootResourceId,
                    description: ""
                });
                
                const projectId = projectResponse.data.resource_id;
                console.log('Created default project:', projectId);
                
                return projectId;
            }
            
            // Return the resource_id from the first project
            const projectId = projects[0].resource_id;
            console.log('Project ID:', projectId);
            
            return projectId;
        } catch (error) {
            console.error('Failed to get project ID:', error);
            throw error;
        }
    },

    createAgent: async (projectId: string) => {
        try {
            // Get the default agent configuration and customize it with provided parameters
            const agentConfig = getDefaultAgentConfig(projectId);
            
            // Make the API request to create the agent
            const response = await axios.post(`${resourcesDomain}/ragapps`, agentConfig);
            console.log('Agent created:', response.data);
            
            if (response.data && response.data.resource_id) {
                return response.data.resource_id;
            } else {
                throw new Error('Failed to create agent: No agent ID returned');
            }
        } catch (error) {
            console.error('Failed to create agent:', error);
            throw error;
        }
    },

    getAgentId: async (projectId: string) => {
        try {
            // Get the list of resources for the project
            const response = await axios.get(`${resourcesDomain}/v2/projects/${projectId}/list`);
            
            // Check if we have any ragapps
            if (response.data && 
                response.data.ragapps && 
                Array.isArray(response.data.ragapps) && 
                response.data.ragapps.length > 0) {
                // Return the first ragapp's resource_id
                const agentId = response.data.ragapps[0].resource_id;
                console.log('Found existing agent ID:', agentId);
                return agentId;
            }
            
            // No ragapps found
            console.log('No agents found for project:', projectId);
            return null;
        } catch (error) {
            console.error('Failed to get agent ID:', error);
            return null;
        }
    },

    stopAgent: async (projectId: string, agentId: string, messageId: string) => {
        try {
            const response = await axios.put(`${Endpoint.chatbotApp}/agent/${projectId}/${agentId}/${messageId}/stop`);
            console.log('Agent stopped:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to stop agent:', error);
            throw error;
        }
    },

    restartAgent: async (agentId: string) => {
        try {
            const response = await axios.put(`${Endpoint.agent}/${agentId}/restart`);
            console.log('Agent restarted:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to restart agent:', error);
            throw error;
        }
    },
    
    updateSystemPrompt: async (systemPrompt: string) => {
        try {
            const { projectId, agentId } = useAgentStore.getState();
            
            if (!projectId || !agentId) {
                throw new Error('Project ID or Agent ID not set');
            }

            // Get the configuration for updating the system prompt
            const config = getUpdateSystemPromptConfig(projectId, agentId, systemPrompt);
            
            // Call the API to update the system prompt
            const response = await axios.put(`${resourcesDomain}/ragapps/${agentId}`, config);
            
            return response.data;
        } catch (error) {
            console.error('Failed to update system prompt:', error);
            throw error;
        }
    },
    
    startVideoRecording: async (agentId: string, conversationId: string) => {
        try {
            // TODO: Implement actual API call
            console.log(`Starting video recording for agent ${agentId} and conversation ${conversationId}`);
            
            // Mock response
            await new Promise(resolve => setTimeout(resolve, 500));
            
            return { success: true };
        } catch (error) {
            console.error('Failed to start video recording:', error);
            return { success: false };
        }
    },
    
    stopVideoRecording: async (agentId: string, conversationId: string) => {
        try {
            // TODO: Implement actual API call
            console.log(`Stopping video recording for agent ${agentId} and conversation ${conversationId}`);
            
            // Mock response
            await new Promise(resolve => setTimeout(resolve, 500));
            
            return { success: true };
        } catch (error) {
            console.error('Failed to stop video recording:', error);
            return { success: false };
        }
    },

    getCurrentBotConfig: async () => {
        try {
            const { projectId } = useAgentStore.getState();
            if (!projectId) {
                throw new Error('Project ID not set');
            }

            const response = await axios.get(`${resourcesDomain}/v2/projects/${projectId}/list`);
            const ragapps = response.data.ragapps;
            
            if (!ragapps || ragapps.length === 0) {
                throw new Error('No ragapps found');
            }

            // Get the first ragapp's app_meta
            return JSON.parse(ragapps[0].app_meta);
        } catch (error) {
            console.error('Failed to get system prompt:', error);
            throw error;
        }
    },

    getSystemPrompt: async () => {
        try {
            const currentConfig = await AgentAPI.getCurrentBotConfig();
            
            // Look for the system message in the auto agent component
            if (currentConfig.components) {
                const autoAgentComponent = currentConfig.components.find(
                    (component) => component.type === "auto_agent"
                );
                if (autoAgentComponent) {
                    const systemMessageInput = autoAgentComponent.inputs.find(
                        (input) => input.name === "System Message"
                    );
                    if (systemMessageInput) {
                        return systemMessageInput.default || "";
                    }
                }
            }
            
            console.log("No auto agent component found");
            return "";
        } catch (error) {
            console.error('Failed to get system prompt:', error);
            return "";
        }
    }
}