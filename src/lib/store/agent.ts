import { create } from 'zustand';

type AgentState = {
  agentId: string;
  isAgentLoading: boolean;
  taskName: string;
  setAgentId: (id: string) => void;
  setIsAgentLoading: (isLoading: boolean) => void;
  setTaskName: (name: string) => void;
  resetAgent: () => void;
};

export const useAgentStore = create<AgentState>((set) => ({
  // TODO: Remove this once we have a real agent ID
  agentId: '4e76fb63-342f-472e-baf8-4ffa440c416f',
  isAgentLoading: true,
  taskName: "Task Name 1",
  setAgentId: (id) => set({ agentId: id }),
  setIsAgentLoading: (isLoading) => set({ isAgentLoading: isLoading }),
  setTaskName: (name) => set({ taskName: name }),
  resetAgent: () => set({ agentId: '', isAgentLoading: false, taskName: "Task Name 1" }),
})); 