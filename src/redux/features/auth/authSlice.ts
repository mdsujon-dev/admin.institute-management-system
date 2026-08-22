import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/types/models";

/**
 * The access token is short lived and kept in `localStorage`, so a page reload
 * does not bounce an operator back to the sign in screen. The refresh token is
 * never visible here: it lives in an httpOnly cookie the browser sends on its
 * own, which is what makes a silent refresh possible.
 */
const TOKEN_KEY = "ims.accessToken";

export type SessionStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  status: SessionStatus;
}

function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    // Private browsing modes can throw on storage access.
    return null;
  }
}

function writeToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* Storage is unavailable; the in-memory token still works for this tab. */
  }
}

const initialState: AuthState = {
  token: readToken(),
  user: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** A fresh access token, from sign in or from a silent refresh. */
    tokenReceived(state, action: PayloadAction<string>) {
      state.token = action.payload;
      writeToken(action.payload);
    },

    userLoaded(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.status = "authenticated";
    },

    sessionRestoring(state) {
      state.status = "loading";
    },

    /**
     * The session could not be restored for a reason that is not the session's
     * fault -- the API was unreachable, rate limited, or briefly broken. The
     * token is kept on purpose, so the next reload can pick the session back up
     * instead of forcing a sign in over a blip.
     */
    sessionUnavailable(state) {
      state.user = null;
      state.status = "unauthenticated";
    },

    /** Sign out, an expired refresh token, or a deactivated account. */
    loggedOut(state) {
      state.token = null;
      state.user = null;
      state.status = "unauthenticated";
      writeToken(null);
    },
  },
});

export const {
  tokenReceived,
  userLoaded,
  sessionRestoring,
  sessionUnavailable,
  loggedOut,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
