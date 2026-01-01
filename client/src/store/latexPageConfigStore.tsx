import { create } from "zustand";
import { useDocumentStore } from "./documentStore";

export interface LatexPageConfig {
  documentClass: {
    type: "article" | "report" | "book";
    fontSize: "10pt" | "11pt" | "12pt";
    paperSize: "a4paper" | "a5paper" | "letter";
    twoSide: boolean;
  };
  orientation: "portrait" | "landscape";
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  lineSpacing: "single" | "oneHalf" | "double";
}

type LatexConfigStore = {
  config: LatexPageConfig;
  originalConfig: LatexPageConfig;

  loadConfig: (config: LatexPageConfig | null) => void; // New: Load config from DB
  setConfig: (config: LatexPageConfig) => void;
  updateConfig: (config: LatexPageConfig) => void; // Changed: Full config, not patch
  resetConfig: () => void;

  hasChanges: () => boolean;
  saveConfig: () => void;
};

const defaultConfig: LatexPageConfig = {
  documentClass: {
    type: "article",
    fontSize: "11pt",
    paperSize: "a4paper",
    twoSide: false,
  },
  orientation: "portrait",
  margins: { top: 2.5, bottom: 2.5, left: 2.5, right: 2.5 },
  lineSpacing: "single",
};

export const useLatexConfigStore = create<LatexConfigStore>((set, get) => ({
  config: defaultConfig,
  originalConfig: defaultConfig,

  // NEW: Load config from database
  loadConfig: (config: LatexPageConfig | null) => {
    const configToUse = config || defaultConfig;
    set({
      config: configToUse,
      originalConfig: JSON.parse(JSON.stringify(configToUse)),
    });
  },

  setConfig: (config) =>
    set({
      config,
      originalConfig: JSON.parse(JSON.stringify(config)),
    }),

  updateConfig: (config) => {
    const isChanged =
      JSON.stringify(config) !== JSON.stringify(get().originalConfig);

    set({ config });

    if (isChanged) {
      useDocumentStore.getState().setSaveStatus("unsaved");
    }
  },

  resetConfig: () =>
    set((state) => ({
      config: JSON.parse(JSON.stringify(state.originalConfig)),
    })),

  hasChanges: () => {
    const { config, originalConfig } = get();
    return JSON.stringify(config) !== JSON.stringify(originalConfig);
  },

  saveConfig: () =>
    set((state) => ({
      originalConfig: JSON.parse(JSON.stringify(state.config)),
    })),
}));
