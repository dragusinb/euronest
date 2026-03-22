import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage, SavedProperty, SavedSearch, PropertyAnalysis, MarketReport } from '../types';

// Portfolio Store
interface PortfolioState {
  properties: SavedProperty[];
  addProperty: (listingId: string, notes?: string) => void;
  removeProperty: (listingId: string) => void;
  updateNotes: (listingId: string, notes: string) => void;
  isInPortfolio: (listingId: string) => boolean;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      properties: [],
      addProperty: (listingId, notes = '') =>
        set(state => ({
          properties: state.properties.some(p => p.listingId === listingId)
            ? state.properties
            : [...state.properties, { listingId, savedAt: Date.now(), notes, tags: [] }]
        })),
      removeProperty: (listingId) =>
        set(state => ({ properties: state.properties.filter(p => p.listingId !== listingId) })),
      updateNotes: (listingId, notes) =>
        set(state => ({
          properties: state.properties.map(p =>
            p.listingId === listingId ? { ...p, notes } : p
          )
        })),
      isInPortfolio: (listingId) => get().properties.some(p => p.listingId === listingId),
    }),
    { name: 'euronest-portfolio' }
  )
);

// Chat Store
interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  addMessage: (msg: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  clearChat: () => void;
  updateLastAssistant: (content: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isLoading: false,
      addMessage: (msg) => set(state => ({ messages: [...state.messages, msg] })),
      setLoading: (isLoading) => set({ isLoading }),
      clearChat: () => set({ messages: [] }),
      updateLastAssistant: (content) =>
        set(state => {
          const msgs = [...state.messages];
          for (let i = msgs.length - 1; i >= 0; i--) {
            if (msgs[i].role === 'assistant') {
              msgs[i] = { ...msgs[i], content };
              break;
            }
          }
          return { messages: msgs };
        }),
    }),
    { name: 'euronest-chat' }
  )
);

// Search Store
interface SearchState {
  savedSearches: SavedSearch[];
  recentQueries: string[];
  saveSearch: (search: SavedSearch) => void;
  removeSearch: (id: string) => void;
  addRecentQuery: (query: string) => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      savedSearches: [],
      recentQueries: [],
      saveSearch: (search) =>
        set(state => ({ savedSearches: [...state.savedSearches, search] })),
      removeSearch: (id) =>
        set(state => ({ savedSearches: state.savedSearches.filter(s => s.id !== id) })),
      addRecentQuery: (query) =>
        set(state => ({
          recentQueries: [query, ...state.recentQueries.filter(q => q !== query)].slice(0, 10)
        })),
    }),
    { name: 'euronest-searches' }
  )
);

// UI Store
interface UIState {
  darkMode: boolean;
  sidebarOpen: boolean;
  chatOpen: boolean;
  toggleDarkMode: () => void;
  setSidebarOpen: (open: boolean) => void;
  setChatOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      darkMode: false,
      sidebarOpen: true,
      chatOpen: false,
      toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setChatOpen: (chatOpen) => set({ chatOpen }),
    }),
    { name: 'euronest-ui' }
  )
);

// Cache Store for AI results
interface CacheState {
  propertyAnalyses: Record<string, PropertyAnalysis>;
  marketReports: Record<string, MarketReport>;
  setPropertyAnalysis: (listingId: string, analysis: PropertyAnalysis) => void;
  setMarketReport: (cityId: string, report: MarketReport) => void;
  getPropertyAnalysis: (listingId: string) => PropertyAnalysis | undefined;
  getMarketReport: (cityId: string) => MarketReport | undefined;
}

export const useCacheStore = create<CacheState>()(
  persist(
    (set, get) => ({
      propertyAnalyses: {},
      marketReports: {},
      setPropertyAnalysis: (listingId, analysis) =>
        set(state => ({ propertyAnalyses: { ...state.propertyAnalyses, [listingId]: analysis } })),
      setMarketReport: (cityId, report) =>
        set(state => ({ marketReports: { ...state.marketReports, [cityId]: report } })),
      getPropertyAnalysis: (listingId) => get().propertyAnalyses[listingId],
      getMarketReport: (cityId) => {
        const report = get().marketReports[cityId];
        if (!report) return undefined;
        // Expire after 24 hours
        if (Date.now() - report.generatedAt > 24 * 60 * 60 * 1000) return undefined;
        return report;
      },
    }),
    { name: 'euronest-cache' }
  )
);

export { useAccessStore } from './accessStore';
