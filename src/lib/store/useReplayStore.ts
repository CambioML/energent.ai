import { create } from 'zustand';
import { useChatStore } from './useChatStore';
import { AgentAPI } from '../api/replay-api';
import toast from 'react-hot-toast';

type ReplayState = {
  historyMode: boolean;
  projectId: string;
  replayId: string;
  taskName: string;
  setProjectId: (id: string) => void;
  setReplayId: (id: string) => void;
  setTaskName: (name: string) => void;
  stopReplay: () => Promise<void>;
  restartReplay: () => Promise<void>;
  initializeReplay: () => Promise<void>;
  initializeProjectId: () => Promise<string>;
  setHistoryMode: (mode: boolean) => void;
};

export const useReplayStore = create<ReplayState>((set, get) => ({
  historyMode: false,
  projectId: '',
  replayId: '',
  taskName: '',
  setReplayId: (id) => set({ replayId: id }),
  setProjectId: (id) => set({ projectId: id }),
  setTaskName: (name) => set({ taskName: name }),
  setHistoryMode: (mode) => set({ historyMode: mode }),
  stopReplay: async () => {
    const { replayId } = get();
    await AgentAPI.stopReplay(replayId);
  },
  restartReplay: async () => {
    const { replayId } = get();
    await AgentAPI.restartReplay(replayId);
  },
  initializeReplay: async () => {
    await get().initializeProjectId();
  },
  initializeProjectId: async () => {
    const projectId = await AgentAPI.getProjectId();
    console.log('Project ID initialized:', projectId);
    set({ projectId });
    return projectId;
  },
})); 