import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist((set, get) => ({
    cartItems: [],

    addToCart: (product) => {
      set((state) => {
        const existingItem = state.cartItems.find(
          (item) => item.id === product.id
        );

        if (existingItem) {
          return {
            cartItems: state.cartItems.map((item) =>
              item.id === product.id ? { ...item, qty: item.qty + 1 } : item
            ),
          };
        }

        return {
          cartItems: [...state.cartItems, { ...product, qty: 1 }],
        };
      });
    },

    increaseQty: (id) => {
      set((state) => ({
        cartItems: state.cartItems.map((item) =>
          item.id === id ? { ...item, qty: item.qty + 1 } : item
        ),
      }));
    },

    decreaseQty: (id) => {
      set((state) => ({
        cartItems: state.cartItems.map((item) =>
          item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
        ),
      }));
    },

    removeFromCart: (id) => {
      set((state) => ({
        cartItems: state.cartItems.filter((item) => item.id !== id),
      }));
    },

    clearCart: () => {
      set({ cartItems: [] });
    },

    getTotalPrice: () => {
      const state = get();
      return state.cartItems.reduce((total, item) => total + item.price * item.qty, 0);
    },

    getTotalItems: () => {
      const state = get();
      return state.cartItems.reduce((total, item) => total + item.qty, 0);
    },
  }), {
    name: "cart-storage",
  })
);
