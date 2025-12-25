import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    isAuthPopupOpen: false,
    isProfilePopupOpen: false,
    isSidebarOpen: false,
    isSearchBarOpen: false,
    isCartOpen: false,
    isAIPopupOpen: false,
  },
  reducers: {
    toggleAuthPopup(state) {
      state.isAuthPopupOpen = !state.isAuthPopupOpen;
    },
    toggleProfilePopup(state) {
      state.isProfilePopupOpen = !state.isProfilePopupOpen;
    },
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleSearchBar(state) {
      state.isSearchBarOpen = !state.isSearchBarOpen;
    },
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },
    toggleAIModal(state) {
      state.isAIPopupOpen = !state.isAIPopupOpen;
    },    
  },
});

export const {
  toggleAuthPopup,
  toggleProfilePopup,
  toggleSidebar,
  toggleSearchBar,
  toggleCart,
  toggleAIModal,
} = popupSlice.actions;
export default popupSlice.reducer;
