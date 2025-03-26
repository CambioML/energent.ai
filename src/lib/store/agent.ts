import { create } from 'zustand';
import { useChatStore } from './chat';
import { AgentAPI } from '../api/agent-api';

export enum AgentStatus {
  Starting = 'Starting',
  Running = 'Running',
  Ready = 'Ready',
  Error = 'Error'
}

type AgentState = {
  agentId: string;
  status: AgentStatus;
  taskName: string;
  isNewTaskModalOpen: boolean;
  setAgentId: (id: string) => void;
  setStatus: (status: AgentStatus) => void;
  setTaskName: (name: string) => void;
  resetAgent: () => Promise<void>;
  openNewTaskModal: () => void;
  closeNewTaskModal: () => void;
  handleNewTask: (keepLayout: boolean) => Promise<void>;
};

export const useAgentStore = create<AgentState>((set) => ({
  agentId: import.meta.env.VITE_AGENT_ID,
  status: AgentStatus.Starting,
  taskName: "Task Name 1",
  isNewTaskModalOpen: false,
  setAgentId: (id) => set({ agentId: id }),
  setStatus: (status) => set({ status }),
  setTaskName: (name) => set({ taskName: name }),
  resetAgent: async () => {
    try {
      await AgentAPI.resetAgent();
      set({ status: AgentStatus.Starting });
    } catch (error) {
      console.error('Failed to reset agent:', error);
    }
  },
  openNewTaskModal: () => set({ isNewTaskModalOpen: true }),
  closeNewTaskModal: () => set({ isNewTaskModalOpen: false }),
  handleNewTask: async (keepLayout: boolean) => {
    try {
      // Generate a new task name
      const newTaskName = `New Task ${Date.now()}`;

      // TODO use keepLayout to determine if we should keep the current layout, call real API
      console.log("keepLayout", keepLayout);
      
      // Update agent store
      set({ 
        status: AgentStatus.Starting,
        taskName: newTaskName,
        isNewTaskModalOpen: false
      });
      
      // Create a new conversation in the chat store
      const chatStore = useChatStore.getState();
      const conversationId = await chatStore.createConversation(newTaskName);
      console.log(`New conversation created with ID: ${conversationId}`);
    } catch (error) {
      console.error("Failed to create new conversation:", error);
    }
  }
})); 