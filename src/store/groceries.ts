import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { GroceryCategory, GroceryItem } from '@/types/models';
import { createId } from '@/utils/id';

export interface GroceryInput {
  name: string;
  quantity: string | null;
  category: GroceryCategory;
}

interface GroceriesState {
  items: GroceryItem[];
  addItem: (input: GroceryInput) => GroceryItem | null;
  updateItem: (id: string, input: GroceryInput) => void;
  toggleItem: (id: string) => void;
  deleteItem: (id: string) => void;
  clearChecked: () => void;
}

function normalizeQuantity(quantity: string | null) {
  const trimmed = quantity?.trim();
  return trimmed ? trimmed : null;
}

export const useGroceriesStore = create<GroceriesState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (input) => {
        const name = input.name.trim();
        if (!name) {
          return null;
        }

        const now = new Date().toISOString();
        const item: GroceryItem = {
          id: createId(),
          name,
          quantity: normalizeQuantity(input.quantity),
          category: input.category,
          checked: false,
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        };

        set((state) => ({ items: [item, ...state.items] }));
        return item;
      },
      updateItem: (id, input) => {
        const name = input.name.trim();
        if (!name) {
          return;
        }

        const now = new Date().toISOString();
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && !item.deletedAt
              ? {
                  ...item,
                  name,
                  quantity: normalizeQuantity(input.quantity),
                  category: input.category,
                  updatedAt: now,
                }
              : item,
          ),
        }));
      },
      toggleItem: (id) => {
        const now = new Date().toISOString();
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && !item.deletedAt
              ? { ...item, checked: !item.checked, updatedAt: now }
              : item,
          ),
        }));
      },
      deleteItem: (id) => {
        const now = new Date().toISOString();
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && !item.deletedAt
              ? { ...item, deletedAt: now, updatedAt: now }
              : item,
          ),
        }));
      },
      clearChecked: () => {
        const now = new Date().toISOString();
        set((state) => ({
          items: state.items.map((item) =>
            item.checked && !item.deletedAt
              ? { ...item, deletedAt: now, updatedAt: now }
              : item,
          ),
        }));
      },
    }),
    {
      name: 'rnn-groceries',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
