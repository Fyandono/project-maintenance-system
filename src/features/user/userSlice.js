import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getUsersList, postUser, putUser} from "../user/api";
const initialState = {users: [], totalPage: 1, currentPage: 1, pageSize: 10, filterName: "", isLoading: false, error: null};

export const fetchUsersThunk = createAsyncThunk("users/fetchUsers", async (filters, {rejectWithValue: rejectWithValue, getState: getState}) => {
	try {
		const data = await getUsersList(filters);
		return data;
	}
	catch (error) {
		return rejectWithValue(error.response?.data?.message || "Failed to retrieve user list.");
	}
});


// 2. Create User (Create)
export const createUserThunk = createAsyncThunk(
    'users/createUser',
    async (userData, { rejectWithValue }) => {
        try {
            const newUser = await postUser(userData);
            return newUser;
        } catch (error) {
            // Use response data for detailed error message if available
            return rejectWithValue(error.response?.data?.message || 'Failed to create user.');
        }
    }
);

// 3. Edit User (Edit)
export const editUserThunk = createAsyncThunk(
    'users/editUser',
    async (userData, { rejectWithValue }) => {
        try {
            const editUser = await putUser(userData);
            return editUser;
        } catch (error) {
            // Use response data for detailed error message if available
            return rejectWithValue(error.response?.data?.message || 'Failed to update user.');
        }
    }
);

const userSlice = createSlice({
	name: "users",
	initialState: initialState,
	reducers: {
		setFilter: (state, action) => {
			const {name: name, value: value} = action.payload;
			state[name] = value;
			state.error = null;
			if (name !== "currentPage") {
				state.currentPage = 1;
			}
		},
		resetFilters: (state) => {
			state.filterName = initialState.filterName;
			state.currentPage = initialState.currentPage;
			state.pageSize = initialState.pageSize;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUsersThunk.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchUsersThunk.fulfilled, (state, action) => {
				state.isLoading = false;
				state.users = action.payload.data || [];
				state.totalPage = action.payload.total_pages || 1;
				state.currentPage = action.payload.page || 1;
				state.pageSize = action.payload.page_size || 10;
				state.error = null;
			})
			.addCase(fetchUsersThunk.rejected, (state, action) => {
				state.isLoading = false;
				state.users = [];
				state.error = action.payload || "An unknown error occurred.";
			})
			.addCase(createUserThunk.pending, (state) => {
				state.isCreating = true;
				state.createError = null;
			})
			.addCase(createUserThunk.fulfilled, (state, action) => {
				state.isCreating = false;
			})
			.addCase(createUserThunk.rejected, (state, action) => {
				state.isCreating = false;
				state.createError = action.payload || "An unknown creation error occurred.";
			})
			.addCase(editUserThunk.pending, (state) => {
				state.isEditing = true;
				state.editError = null;
			})
			.addCase(editUserThunk.fulfilled, (state, action) => {
				state.isEditing = false;
			})
			.addCase(editUserThunk.rejected, (state, action) => {
				state.isEditing = false;
				state.editError = action.payload || "An unknown creation error occurred.";
			});
	},
});
export const {setFilter: setFilter, resetFilters: resetFilters} = userSlice.actions;
export default userSlice.reducer;
