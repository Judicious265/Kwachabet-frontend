import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        Cookies.set('kb_token', token, { expires: 7, secure: true, sameSite: 'strict' });
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        Cookies.remove('kb_token');
        set({ user: null, token: null, isAuthenticated: false });
        if (typeof window !== 'undefined') window.location.href = '/';
      },
      updateUser: (updates) => set((s) => ({ user: { ...s.user, ...updates } })),
    }),
    { name: 'kb-auth', partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }) }
  )
);

export const useWalletStore = create((set) => ({
  balance: 0,
  bonusBalance: 0,
  available: 0,
  currency: 'MWK',
  setWallet: (d) => set({ balance: d.balance || 0, bonusBalance: d.bonus_balance || 0, available: d.available || 0, currency: d.currency || 'MWK' }),
}));

export const useBetSlipStore = create((set, get) => ({
  selections: [],
  stake: '',
  useBonus: false,
  isOpen: false,
  addSelection: (sel) => {
    const { selections } = get();
    const same = selections.find(s => s.event_id === sel.event_id && s.market_type === sel.market_type);
    if (same && same.selection === sel.selection) {
      set({ selections: selections.filter(s => !(s.event_id === sel.event_id && s.market_type === sel.market_type)) });
      return;
    }
    const filtered = selections.filter(s => !(s.event_id === sel.event_id && s.market_type === sel.market_type));
    set({ selections: [...filtered, sel], isOpen: true });
  },
  removeSelection: (marketId) => set((s) => ({ selections: s.selections.filter(x => x.market_id !== marketId) })),
  clearSlip: () => set({ selections: [], stake: '' }),
  setStake: (stake) => set({ stake }),
  setUseBonus: (v) => set({ useBonus: v }),
  setOpen: (v) => set({ isOpen: v }),
  isSelected: (marketId, selection) => get().selections.some(s => s.market_id === marketId && s.selection === selection),
  getTotalOdds: () => {
    const { selections } = get();
    if (!selections.length) return 0;
    return parseFloat(selections.reduce((a, s) => a * parseFloat(s.odds), 1).toFixed(3));
  },
  getPotentialWin: () => {
    const { stake } = get();
    const odds = get().getTotalOdds();
    if (!stake || !odds) return 0;
    return parseFloat((parseFloat(stake) * odds * 0.8).toFixed(2));
  },
}));

export const useOddsStore = create((set) => ({
  events: [],
  connected: false,
  setEvents: (events) => set({ events }),
  setConnected: (v) => set({ connected: v }),
}));
