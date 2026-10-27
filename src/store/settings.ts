import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Language } from '@/i18n';

interface SettingsState {
  language: Language | null;
  setLanguage: (language: Language) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: null,
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'rnn-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
