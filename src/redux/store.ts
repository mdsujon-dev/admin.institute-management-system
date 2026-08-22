import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./api/baseApi";
import { authReducer } from "./features/auth/authSlice";
import { uiReducer } from "./features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

// Enables the refetch-on-reconnect behaviour configured on `baseApi`.
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
