import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },

  reducers: {
    // ========================= ADD TO CART =========================
    addToCart (state, action) {
      const product = action.payload;
      const quantity = 1;

      const existingItem = state.cart.find(
        (item) => item?.product?.id === product?.id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({
          product,
          quantity,
        });
      }
    },

    // ========================= REMOVE ITEM =========================
    removeFromCart: (state, action) => {
      const productId = action.payload;

      state.cart = state.cart.filter(
        (item) => item.product.id !== productId
      );
    },

    // ========================= UPDATE QUANTITY =========================
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;

      const item = state.cart.find(
        (item) => item?.product?.id === id
      );

      if (item) {
        item.quantity = quantity;
      }
    },

    // ========================= CLEAR CART =========================
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
