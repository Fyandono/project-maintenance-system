// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiLoginUser } from './api';
import { decodeToken } from '../../core/utils/jwt'; // Reuse your utility
import TokenService from '../../core/api/tokenService';

// Initial state, checking localStorage immediately
const initialToken = localStorage.getItem('accessToken');
const initialUser = initialToken ? decodeToken(initialToken) : null;

// ⚡ 1. The Async Thunk (Login Logic)
export const loginUserThunk = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const token = await apiLoginUser(username, password);
      const user = decodeToken(token);
      TokenService.setAccessToken(token);
      
      return { token, user }; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed.');
    }
  }
);

// ⚡ 2. The Slice (State Definition and Reducers)
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: initialToken,
    user: initialUser,
    isLoading: false,
    error: null,
  },
  reducers: {
    // Synchronous action to handle logout
    logout: (state) => {
      localStorage.removeItem('accessToken');
      state.token = null;
      state.user = null;
      state.error = null;
      state.isLoading = false; // Ensure loading is reset
    },
  },
  // ⚡ 3. Extra Reducers (State Transitions based on Thunk status)
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; 
        state.token = null;
        state.user = null;
      });
  },
});

export const { logout } = authSlice.actions;

// Export the reducer as the default export
export default authSlice.reducer;