import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AccessState {
  isPremium: boolean;
  activatedAt: number | null;
  accessMethod: 'code' | 'purchase' | 'lightly' | null;
  activate: (method: 'code' | 'purchase' | 'lightly') => void;
  deactivate: () => void;
}

export const useAccessStore = create<AccessState>()(
  persist(
    (set) => ({
      isPremium: false,
      activatedAt: null,
      accessMethod: null,
      activate: (method) => set({ isPremium: true, activatedAt: Date.now(), accessMethod: method }),
      deactivate: () => set({ isPremium: false, activatedAt: null, accessMethod: null }),
    }),
    { name: 'euronest-access' }
  )
);
