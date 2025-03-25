import { create } from 'zustand';

type SidebarState = {
  isExpanded: boolean;
  activeButton: string | null;
  setIsExpanded: (value: boolean) => void;
  setActiveButton: (value: string | null) => void;
  toggleSidebar: () => void;
  handleButtonClick: (buttonName: string) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isExpanded: false,
  activeButton: null,
  setIsExpanded: (value) => set({ isExpanded: value }),
  setActiveButton: (value) => set({ activeButton: value }),
  toggleSidebar: () => set((state) => ({ isExpanded: !state.isExpanded })),
  handleButtonClick: (buttonName) => set((state) => {
    const newActiveButton = buttonName === state.activeButton ? null : buttonName;
    // If clicking a button while sidebar is collapsed, expand it
    const newIsExpanded = !state.isExpanded ? true : state.isExpanded;
    return { 
      activeButton: newActiveButton,
      isExpanded: newIsExpanded
    };
  }),
})); 