import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: true }),

  logout: () => set({ user: null, isAuthenticated: false }),

  initializeAuth: async () => {
    try {
      const result = await window.storage.get("currentUser");
      if (result && result.value) {
        const user = JSON.parse(result.value);
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      console.log("No user logged in");
    }
  },
}));
