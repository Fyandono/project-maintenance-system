import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRolesList } from './api';

const initialState = {
	roles: [],
	filterName: '',
	isLoading: false,
	error: null,
};

export const fetchRolesThunk = createAsyncThunk(
	'roles/fetchRoles',
	async (filters, { rejectWithValue, getState }) => {
		try {
			const data = await getRolesList(filters);
			return data;
		} catch (error) {
			return rejectWithValue(error.response?.data?.message || 'Failed to retrieve roles list.');
		}
	}
);

// --- Slice Definition ---
const roleSlice = createSlice({
	name: 'roles',
	initialState,

	// Synchronous Reducers
	reducers: {
		/**
		 * Action to update filters (now only filterName).
		 * @param {{name: string, value: any}} payload - The filter field and its new value.
		 */
		setFilter: (state, action) => {
			const { name, value } = action.payload;

			// Only allow updates for 'filterName'
			if (name === 'filterName') {
				 state[name] = value;
			}
			
			state.error = null; // Clear error upon new interaction
		},

		// Optional: Reset all filters
		resetFilters: (state) => {
			state.filterName = initialState.filterName;
			// filterVendorId REMOVED from reset
		}
	},

	// Handling the Asynchronous Thunk (State Transitions)
	extraReducers: (builder) => {
		builder
			// PENDING: Loading state
			.addCase(fetchRolesThunk.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})

			// FULFILLED: Success state
			.addCase(fetchRolesThunk.fulfilled, (state, action) => {
				state.isLoading = false;
				state.roles = action.payload.data || [];
				state.error = null;
			})

			// REJECTED: Failure state
			.addCase(fetchRolesThunk.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload || action.error.message || 'An unknown error occurred.'; 
			});
	},
});

// Export synchronous actions for the UI components to dispatch
export const { setFilter, resetFilters } = roleSlice.actions;

// Export the reducer to be included in the central store
export default roleSlice.reducer;