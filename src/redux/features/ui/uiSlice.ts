import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  /** Desktop rail collapsed. Persisted for the tab only, not across reloads. */
  isSidebarCollapsed: boolean;
  /** Mobile drawer open. */
  isMobileNavOpen: boolean;
}

const initialState: UiState = {
  isSidebarCollapsed: false,
  isMobileNavOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    sidebarToggled(state) {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
    mobileNavToggled(state) {
      state.isMobileNavOpen = !state.isMobileNavOpen;
    },
    mobileNavSet(state, action: PayloadAction<boolean>) {
      state.isMobileNavOpen = action.payload;
    },
  },
});

export const { sidebarToggled, mobileNavToggled, mobileNavSet } = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
