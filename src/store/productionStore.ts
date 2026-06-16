import { create } from "zustand";
import type { ModuleKey } from "../types";

interface AppState {
  activeModule: ModuleKey;
  sidebarCollapsed: boolean;
  user: {
    name: string;
    role: string;
  };
  selectedBatchForAnalysis: string | null;
  setActiveModule: (module: ModuleKey) => void;
  toggleSidebar: () => void;
  setUser: (user: { name: string; role: string }) => void;
  setSelectedBatchForAnalysis: (batch: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeModule: "dashboard",
  sidebarCollapsed: false,
  user: {
    name: "张建国",
    role: "工艺工程师",
  },
  selectedBatchForAnalysis: null,
  setActiveModule: (module) => set({ activeModule: module }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setUser: (user) => set({ user }),
  setSelectedBatchForAnalysis: (batch) => set({ selectedBatchForAnalysis: batch }),
}));
