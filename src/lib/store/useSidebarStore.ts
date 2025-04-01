import { create } from 'zustand';

type SidebarState = {
  isExpanded: boolean;
  expandedAccordions: Record<string, boolean>;
  setIsExpanded: (value: boolean) => void;
  toggleSidebar: () => void;
  handleButtonClick: (buttonName: string) => void;
  toggleAccordion: (accordionName: string) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isExpanded: false,
  expandedAccordions: {
    history: false,
    files: false,
    upload: false,
  },
  setIsExpanded: (value) => set({ isExpanded: value }),
  toggleSidebar: () => set((state) => ({ isExpanded: !state.isExpanded })),
  handleButtonClick: (buttonName) => set((state) => {
    // If clicking a button while sidebar is collapsed, expand it
    const newIsExpanded = !state.isExpanded ? true : state.isExpanded;
    
    // When activating a button, expand its accordion and collapse others
    const newExpandedAccordions = {
      ...state.expandedAccordions,
    };
    
    if (buttonName) {
      Object.keys(newExpandedAccordions).forEach(key => {
        newExpandedAccordions[key] = key === buttonName;
      });
    }
    
    return { 
      isExpanded: newIsExpanded,
      expandedAccordions: newExpandedAccordions
    };
  }),
  toggleAccordion: (accordionName) => set((state) => {
    const newExpandedAccordions = {
      ...state.expandedAccordions,
      [accordionName]: !state.expandedAccordions[accordionName]
    };
    
    return {
      expandedAccordions: newExpandedAccordions
    };
  }),
})); 