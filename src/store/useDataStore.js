import { create } from 'zustand';

const persistKey = 'consulting-dashboard:dark-mode';

export const useDataStore = create((set) => ({
  // Theme
  darkModeEnabled: (() => {
    try {
      const stored = localStorage.getItem(persistKey);
      if (stored === 'true') return true;
      if (stored === 'false') return false;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  })(),
  toggleDarkMode: () =>
    set((state) => {
      const next = !state.darkModeEnabled;
      try { localStorage.setItem(persistKey, String(next)); } catch (e) { /* ignore */ }
      return { darkModeEnabled: next };
    }),

  // Caching for data fetched during the session
  cache: {
    clients: null,
    projects: null,
    tickets: null,
    byClient: new Map(),
    byProject: new Map(),
  },
  setCache: (updater) => set((state) => ({ cache: updater(structuredClone(state.cache)) })),

  // Local tickets created via modal (not persisted remotely)
  localTickets: [],
  addLocalTicket: (ticket) => set((state) => ({ localTickets: [ticket, ...state.localTickets] })),
}));


