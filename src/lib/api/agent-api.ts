import axios from 'axios';
import { resourcesDomain, Endpoint } from './endpoints';
import { getDefaultAgentConfig } from '../utils/agent-config';
import { getUserInfo } from '../utils/local-storage';
import { ChatAPI } from './chat-api';

interface AgentAPI {
    getAgentStatus: (agentId: string) => Promise<{
        message: 'Ready' | 'Loading' | 'Running' | 'Error';
    }>;
    resetAgent: (agentId: string) => Promise<void>;
    getProjectId: () => Promise<string>;
    createAgent: (projectId: string) => Promise<string>;
    getAgentId: (projectId: string) => Promise<string | null>;
}

export const AgentAPI: AgentAPI = {
    getAgentStatus: async (agentId: string) => {
        try {
            const response = await axios.get(`${resourcesDomain}/agent/${agentId}/status`);
            return response.data;
        } catch (error) {
            console.error('Failed to get agent status:', error);
            return { message: 'Error' };
        }
    },
    
    resetAgent: async (agentId: string) => {
        try {
            const response = await axios.post(`${resourcesDomain}/${agentId}/reset`);
            return response.data;
        } catch (error) {
            console.error('Failed to reset agent:', error);
            throw error;
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
            
            if (response.data && response.data.agent_id) {
                return response.data.agent_id;
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
            console.log('Response:', response.data);
            
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
    }
}