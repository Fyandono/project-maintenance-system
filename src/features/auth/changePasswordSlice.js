import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiChangePassword } from './api';
import TokenService from '../../core/api/tokenService';

// Initial state
const initialState = {
  isLoading: false,
  error: null,
  success: false, 
};

// Async thunk
export const changePasswordThunk = createAsyncThunk(
  'changePassword/changePassword',
  async ({ newPassword, currentPassword }, { rejectWithValue }) => {
    try {
      await apiChangePassword(newPassword, currentPassword);
      TokenService.removeAccessToken();

      return { success: true };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Change password failed.');
    }
  }
);

// The slice
const changePasswordSlice = createSlice({
  name: 'changePassword',
  initialState,
  reducers: {
    // Clear error/success states
    clearStatus: (state) => {
      state.error = null;
      state.success = false;
    },
    // Reset state
    resetChangePassword: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePasswordThunk.pending, (state) => { // Fixed: use changePasswordThunk
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => { // Fixed: use changePasswordThunk
        state.isLoading = false;
        state.success = true;
      })
      .addCase(changePasswordThunk.rejected, (state, action) => { // Fixed: use changePasswordThunk
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

// Export actions and reducer
export const { clearStatus, resetChangePassword } = changePasswordSlice.actions;
export default changePasswordSlice.reducer;