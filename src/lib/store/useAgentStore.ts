import { create } from 'zustand';
import { useChatStore } from './useChatStore';
import { AgentAPI } from '../api/agent-api';
import toast from 'react-hot-toast';

export enum AgentStatus {
  Starting = 'Starting',
  Running = 'Running',
  Ready = 'Ready',
  Error = 'Error'
}

type AgentState = {
  historyMode: boolean;
  projectId: string;
  agentId: string;
  status: AgentStatus;
  taskName: string;
  isNewTaskModalOpen: boolean;
  isRecordingVideo: boolean;
  systemPrompt: string;
  isSystemPromptLoading: boolean;
  setProjectId: (id: string) => void;
  setAgentId: (id: string) => void;
  setStatus: (status: AgentStatus) => void;
  setTaskName: (name: string) => void;
  setIsRecordingVideo: (isRecording: boolean) => void;
  setSystemPrompt: (prompt: string) => void;
  setIsSystemPromptLoading: (isLoading: boolean) => void;
  stopAgent: () => Promise<void>;
  restartAgent: () => Promise<void>;
  openNewTaskModal: () => void;
  closeNewTaskModal: () => void;
  handleNewTask: (keepLayout: boolean) => Promise<void>;
  initializeAgent: () => Promise<void>;
  initializeProjectId: () => Promise<string>;
  initializeAgentId: () => Promise<string>;
  setHistoryMode: (mode: boolean) => void;
};

export const useAgentStore = create<AgentState>((set, get) => ({
  historyMode: false,
  projectId: '',
  agentId: '',
  status: AgentStatus.Starting,
  taskName: "Task Name 1",
  isNewTaskModalOpen: false,
  isRecordingVideo: false,
  systemPrompt: '',
  isSystemPromptLoading: true,
  setStatus: (status) => set({ status }),
  setAgentId: (id) => set({ agentId: id }),
  setProjectId: (id) => set({ projectId: id }),
  setTaskName: (name) => set({ taskName: name }),
  setHistoryMode: (mode) => set({ historyMode: mode }),
  setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
  setIsSystemPromptLoading: (isLoading) => set({ isSystemPromptLoading: isLoading }),
  setIsRecordingVideo: (isRecording) => set({ isRecordingVideo: isRecording }),
  stopAgent: async () => {
    const { agentId } = get();
    await AgentAPI.stopAgent(agentId);
    set({ status: AgentStatus.Ready });
  },
  restartAgent: async () => {
    const { agentId } = get();
    await AgentAPI.restartAgent(agentId);
    set({ status: AgentStatus.Starting });
  },
  openNewTaskModal: () => set({ isNewTaskModalOpen: true }),
  closeNewTaskModal: () => set({ isNewTaskModalOpen: false }),
  handleNewTask: async (keepLayout: boolean) => {
    const loadingToast = toast.loading("Creating new task...");
    try {
      // Generate a new task name
      const newTaskName = `New Task ${Date.now()}`;
      console.log("keepLayout", keepLayout);

      if (!keepLayout) {
        await get().restartAgent()
        // Update agent store
        set({ 
          status: AgentStatus.Starting,
          taskName: newTaskName,
        });
      }
      
      // Create a new conversation in the chat store
      const chatStore = useChatStore.getState();
      const { projectId, agentId } = get();
      
      const conversationId = await chatStore.createConversation(newTaskName, projectId, agentId);
      chatStore.setCurrentConversationId(conversationId);
      console.log(`New conversation created with ID: ${conversationId}`);
      toast.success("New task created", { id: loadingToast });
    } catch (error) {
      console.error('Error creating new task:', error);
      toast.error('Failed to create new task', { id: loadingToast });
      set({ status: AgentStatus.Error });
    }
  },
  initializeAgent: async () => {
    await get().initializeProjectId();
    await get().initializeAgentId();
  },
  initializeProjectId: async () => {
    const projectId = await AgentAPI.getProjectId();
    console.log('Project ID initialized:', projectId);
    set({ projectId });
    return projectId;
  },
  initializeAgentId: async () => {
    const { projectId } = get();
    
    if (!projectId) {
      throw new Error('Project ID not set. Please initialize project ID first.');
    }
    
    let agentId = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (!agentId && attempts < maxAttempts) {
      // Try to get an existing agent ID
      agentId = await AgentAPI.getAgentId(projectId);
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Attempting to get agent ID...', attempts);
      attempts++;
    }
      
    if (agentId) {
      // If we got a real agent ID, use it
      console.log('Using existing agent ID:', agentId);
      set({ agentId });
      return agentId;
    } else {
      // If no agent ID was found, create a new agent
      console.log('No existing agent found, creating a new one...');
      const agentId = await AgentAPI.createAgent(projectId);
      console.log('Agent created:', agentId);
      set({ agentId });
      return agentId;
    }
  }
})); 