import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { BlocksByType } from "@/types/block.types";

export interface DocumentBlockConfig {
  [key: string]: any;
}

export interface DocumentBlock {
  id: string;
  blockDefId: string;
  order: number;
  name: string;
  config: DocumentBlockConfig;
}

// History snapshot type
interface HistorySnapshot {
  blocks: DocumentBlock[];
  timestamp: number;
}

type DocumentStore = {
  saveStatus: "saved" | "unsaved" | "saving";
  setSaveStatus: (status: "saved" | "unsaved" | "saving") => void;
  lastSaved: Date | null;
  setLastSaved: (date: Date | null) => void;

  blocks: DocumentBlock[];
  recentlyUsedBlocks: BlocksByType[];
  originalBlocks: DocumentBlock[];
  selectedBlock: DocumentBlock | null;

  addedIds: Set<string>;
  updatedIds: Set<string>;
  removedIds: Set<string>;
  orderChangedIds: Set<string>;

  // History management
  history: HistorySnapshot[];
  historyIndex: number;
  maxHistorySize: number;

  // Visual feedback for undo/redo
  lastChangedBlockId: string | null;
  clearLastChangedBlock: () => void;
  setLastChangedBlockId: (id: string | null) => void;

  setBlocks: (blocks: DocumentBlock[]) => void;
  setSelectedBlock: (block: DocumentBlock | null) => void;

  addBlock: (block: Omit<DocumentBlock, "id" | "order">) => void;
  updateBlock: (id: string, patch: Partial<DocumentBlock>) => void;
  removeBlock: (id: string) => void;
  reorderBlocks: (newOrder: DocumentBlock[]) => void;
  addRecentlyUsedBlocks: (block: BlocksByType[]) => void;
  addRecentlyUsedBlock: (block: BlocksByType) => void;

  // History operations
  pushToHistory: (changedBlockId?: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;

  hasChanges: () => boolean;
  clearChanges: () => void;
  getChangesPayload: () => {
    added: DocumentBlock[];
    updated: DocumentBlock[];
    removed: string[];
    orderUpdates: { id: string; order: number }[];
  };
};

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  saveStatus: "saved",
  setSaveStatus: (status) => set({ saveStatus: status }),
  lastSaved: null,
  setLastSaved: (date) => set({ lastSaved: date }),

  blocks: [],
  originalBlocks: [],
  selectedBlock: null,
  recentlyUsedBlocks: [],

  addedIds: new Set(),
  updatedIds: new Set(),
  removedIds: new Set(),
  orderChangedIds: new Set(),

  // History state
  history: [],
  historyIndex: -1,
  maxHistorySize: 50,

  // Visual feedback
  lastChangedBlockId: null,
  clearLastChangedBlock: () => set({ lastChangedBlockId: null }),
  setLastChangedBlockId: (id) => set({ lastChangedBlockId: id }),

  setBlocks: (blocks) => {
    set({
      blocks,
      originalBlocks: JSON.parse(JSON.stringify(blocks)),
      addedIds: new Set(),
      updatedIds: new Set(),
      removedIds: new Set(),
      orderChangedIds: new Set(),
      // Initialize history with first state
      history:
        blocks.length > 0
          ? [
              {
                blocks: JSON.parse(JSON.stringify(blocks)),
                timestamp: Date.now(),
              },
            ]
          : [],
      historyIndex: blocks.length > 0 ? 0 : -1,
    });
  },

  setSelectedBlock: (block) => set({ selectedBlock: block }),

  /**
   * Push current blocks state to history
   * This is called after mutations (add, remove, reorder, blur)
   */
  pushToHistory: (changedBlockId?: string) => {
    const state = get();
    const currentBlocks = state.blocks;

    // Don't push if blocks are empty
    if (currentBlocks.length === 0) return;

    // Check if this state is identical to the current history entry
    if (state.historyIndex >= 0) {
      const currentHistoryState = state.history[state.historyIndex];
      if (
        JSON.stringify(currentHistoryState.blocks) ===
        JSON.stringify(currentBlocks)
      ) {
        // State hasn't changed, don't push
        return;
      }
    }

    // Create deep copy of current state
    const snapshot: HistorySnapshot = {
      blocks: JSON.parse(JSON.stringify(currentBlocks)),
      timestamp: Date.now(),
    };

    // If we're in the middle of history (after undo), remove all future states
    const newHistory = state.history.slice(0, state.historyIndex + 1);

    // Add new snapshot
    newHistory.push(snapshot);

    // Trim history if it exceeds max size (keep recent states)
    const trimmedHistory =
      newHistory.length > state.maxHistorySize
        ? newHistory.slice(newHistory.length - state.maxHistorySize)
        : newHistory;

    set({
      history: trimmedHistory,
      historyIndex: trimmedHistory.length - 1,
      lastChangedBlockId: changedBlockId || state.selectedBlock?.id || null,
    });
  },

  /**
   * Undo: Go back one step in history
   */
  undo: () => {
    const state = get();
    if (!state.canUndo()) return;

    const prevSnapshot = state.history[state.historyIndex];
    const newIndex = state.historyIndex - 1;
    const nextSnapshot = state.history[newIndex];

    const restoredBlocks = JSON.parse(
      JSON.stringify(nextSnapshot.blocks)
    ) as DocumentBlock[];

    const changedBlockId = findChangedBlockId(
      prevSnapshot.blocks,
      restoredBlocks
    );

    set({
      blocks: restoredBlocks,
      historyIndex: newIndex,
      saveStatus: "unsaved",
      // selectedBlock: changedBlockId
      //   ? restoredBlocks.find((b) => b.id === changedBlockId) ?? null
      //   : null,
      lastChangedBlockId: changedBlockId,
    });

    recalculateChanges();
  },

  /**
   * Redo: Go forward one step in history
   */
  redo: () => {
    const state = get();
    if (!state.canRedo()) return;

    const prevSnapshot = state.history[state.historyIndex];
    const newIndex = state.historyIndex + 1;
    const nextSnapshot = state.history[newIndex];

    const restoredBlocks = JSON.parse(
      JSON.stringify(nextSnapshot.blocks)
    ) as DocumentBlock[];

    const changedBlockId = findChangedBlockId(
      prevSnapshot.blocks,
      restoredBlocks
    );

    set({
      blocks: restoredBlocks,
      historyIndex: newIndex,
      saveStatus: "unsaved",
      // // selectedBlock: changedBlockId
      //   ? restoredBlocks.find((b) => b.id === changedBlockId) ?? null
      //   : null,
      lastChangedBlockId: changedBlockId,
    });

    recalculateChanges();
  },

  canUndo: () => {
    const state = get();
    return state.historyIndex > 0;
  },

  canRedo: () => {
    const state = get();
    return state.historyIndex < state.history.length - 1;
  },

  clearHistory: () => {
    set({
      history: [],
      historyIndex: -1,
    });
  },

  addBlock: (block) =>
    set((state) => {
      const order = state.blocks.length + 1;

      const newBlock: DocumentBlock = {
        ...block,
        id: uuidv4(),
        order,
        name: `${block.name}-${order}`,
      };

      const added = new Set(state.addedIds);
      added.add(newBlock.id);

      const newBlocks = [...state.blocks, newBlock];
      // state.addRecentlyUsedBlock(block.blockDefId);

      // Update state
      const newState = {
        blocks: newBlocks,
        addedIds: added,
        saveStatus: "unsaved" as const,
      };

      // Push to history immediately after state update
      setTimeout(() => get().pushToHistory(newBlock.id), 0);

      return newState;
    }),

  updateBlock: (id, patch) => {
    const state = get();

    const blocks = state.blocks.map((b) =>
      b.id === id ? { ...b, ...patch } : b
    );

    const existedBefore = state.originalBlocks.find((b) => b.id === id);
    const updated = new Set(state.updatedIds);

    if (existedBefore && !state.addedIds.has(id)) {
      updated.add(id);
    }

    // Update the selected block if it's the one being modified
    const selectedBlock =
      state.selectedBlock?.id === id
        ? blocks.find((b) => b.id === id) || state.selectedBlock
        : state.selectedBlock;

    set({
      blocks,
      updatedIds: updated,
      saveStatus: "unsaved",
      selectedBlock,
    });
  },

  removeBlock: (id) =>
    set((state) => {
      const existedBefore = state.originalBlocks.find((b) => b.id === id);

      const added = new Set(state.addedIds);
      const removed = new Set(state.removedIds);
      const updated = new Set(state.updatedIds);
      const orderChanged = new Set(state.orderChangedIds);

      if (added.has(id)) {
        added.delete(id);
        updated.delete(id);
        orderChanged.delete(id);
      } else if (existedBefore) {
        removed.add(id);
        updated.delete(id);
        orderChanged.delete(id);
      }

      const newBlocks = state.blocks.filter((b) => b.id !== id);

      // Push to history immediately
      setTimeout(() => get().pushToHistory(), 0);

      return {
        blocks: newBlocks,
        addedIds: added,
        removedIds: removed,
        updatedIds: updated,
        orderChangedIds: orderChanged,
        saveStatus: "unsaved",
        selectedBlock:
          state.selectedBlock?.id === id ? null : state.selectedBlock,
      };
    }),

  reorderBlocks: (newOrder) =>
    set((state) => {
      const updated = new Set(state.updatedIds);
      const orderChanged = new Set(state.orderChangedIds);

      const reordered = newOrder.map((b, index) => {
        const updatedBlock = { ...b, order: index + 1 };
        const original = state.originalBlocks.find(
          (o) => o.id === updatedBlock.id
        );

        if (
          original &&
          original.order !== updatedBlock.order &&
          !state.addedIds.has(updatedBlock.id)
        ) {
          orderChanged.add(updatedBlock.id);

          if (!updated.has(updatedBlock.id)) {
            updated.add(updatedBlock.id);
          }
        }

        return updatedBlock;
      });

      // Push to history immediately
      setTimeout(() => get().pushToHistory(), 0);

      return {
        blocks: reordered,
        updatedIds: updated,
        orderChangedIds: orderChanged,
        saveStatus: "unsaved",
      };
    }),

  addRecentlyUsedBlocks: (blocks) =>
    set((state) => {
      const newBlocks = [...blocks];
      const existing = state.recentlyUsedBlocks;

      // Merge new blocks with existing, removing duplicates
      const merged = [
        ...newBlocks,
        ...existing.filter((e) => !newBlocks.some((n) => n.id === e.id)),
      ].slice(0, 10);

      return { recentlyUsedBlocks: merged };
    }),

  addRecentlyUsedBlock: (block) =>
    set((state) => ({
      recentlyUsedBlocks: [
        block,
        ...state.recentlyUsedBlocks.filter((b) => b.id !== block.id),
      ].slice(0, 10),
    })),

  hasChanges: () =>
    get().addedIds.size > 0 ||
    get().updatedIds.size > 0 ||
    get().removedIds.size > 0 ||
    get().orderChangedIds.size > 0,

  clearChanges: () =>
    set((state) => ({
      originalBlocks: JSON.parse(JSON.stringify(state.blocks)),
      addedIds: new Set(),
      updatedIds: new Set(),
      removedIds: new Set(),
      orderChangedIds: new Set(),
    })),

  getChangesPayload: () => {
    const state = get();

    return {
      added: state.blocks.filter((b) => state.addedIds.has(b.id)),
      updated: state.blocks.filter((b) => state.updatedIds.has(b.id)),
      removed: Array.from(state.removedIds),
      orderUpdates: Array.from(state.orderChangedIds).map((id) => {
        const block = state.blocks.find((b) => b.id === id)!;
        return { id, order: block.order };
      }),
    };
  },
}));

/**
 * Helper function to recalculate change tracking after undo/redo
 * This ensures addedIds, updatedIds, etc. are accurate
 */
function recalculateChanges() {
  const state = useDocumentStore.getState();
  const currentBlocks = state.blocks;
  const originalBlocks = state.originalBlocks;

  const addedIds = new Set<string>();
  const updatedIds = new Set<string>();
  const removedIds = new Set<string>();
  const orderChangedIds = new Set<string>();

  // Find added and updated blocks
  currentBlocks.forEach((current) => {
    const original = originalBlocks.find((o) => o.id === current.id);

    if (!original) {
      // Block doesn't exist in original → added
      addedIds.add(current.id);
    } else {
      // Check if config or name changed
      const configChanged =
        JSON.stringify(current.config) !== JSON.stringify(original.config);
      const nameChanged = current.name !== original.name;

      if (configChanged || nameChanged) {
        updatedIds.add(current.id);
      }

      // Check if order changed
      if (current.order !== original.order) {
        orderChangedIds.add(current.id);
        if (!updatedIds.has(current.id)) {
          updatedIds.add(current.id);
        }
      }
    }
  });

  // Find removed blocks
  originalBlocks.forEach((original) => {
    const exists = currentBlocks.find((c) => c.id === original.id);
    if (!exists) {
      removedIds.add(original.id);
    }
  });

  useDocumentStore.setState({
    addedIds,
    updatedIds,
    removedIds,
    orderChangedIds,
  });
}

function findChangedBlockId(
  prev: DocumentBlock[],
  next: DocumentBlock[]
): string | null {
  const prevMap = new Map(prev.map((b) => [b.id, b]));
  const nextMap = new Map(next.map((b) => [b.id, b]));

  // 1. Added
  for (const id of nextMap.keys()) {
    if (!prevMap.has(id)) return id;
  }

  // 2. Removed
  for (const id of prevMap.keys()) {
    if (!nextMap.has(id)) return id;
  }

  // 3. Updated / reordered
  for (const [id, nextBlock] of nextMap) {
    const prevBlock = prevMap.get(id);
    if (!prevBlock) continue;

    if (
      prevBlock.order !== nextBlock.order ||
      prevBlock.name !== nextBlock.name ||
      JSON.stringify(prevBlock.config) !== JSON.stringify(nextBlock.config)
    ) {
      return id;
    }
  }

  return null;
}
