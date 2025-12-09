import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getRolesList, postRole, putRole} from "./api";

const initialState = {roles: [], totalPage: 1, currentPage: 1, pageSize: 10, filterName: "", isLoading: false, error: null};

export const fetchRolesThunk = createAsyncThunk("role/fetchRoles", async (filters, {rejectWithValue: rejectWithValue, getState: getState}) => {
	try {
		console.log(filters);
		const data = await getRolesList(filters);
		return data;
	}
	catch (error) {
		return rejectWithValue(error.response?.data?.message || "Failed to retrieve role list.");
	}
});
export const createRoleThunk = createAsyncThunk("role/createRole", async (roleData, {rejectWithValue: rejectWithValue}) => {
	try {
		const newRole = await postRole(roleData);
		return newRole;
	}
	catch (error) {
		return rejectWithValue(error.response?.data?.message || "Failed to create role.");
	}
});
export const editRoleThunk = createAsyncThunk("role/editRole", async (roleData, {rejectWithValue: rejectWithValue}) => {
	try {
		const editRole = await putRole(roleData);
		return editRole;
	}
	catch (error) {
		return rejectWithValue(error.response?.data?.message || "Failed to update role.");
	}
});
const roleSlice = createSlice({
	name: "role",
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
			.addCase(fetchRolesThunk.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchRolesThunk.fulfilled, (state, action) => {
				state.isLoading = false;
				state.roles = action.payload.data || [];
				state.totalPage = action.payload.total_pages || 1;
				state.currentPage = action.payload.page || 1;
				state.pageSize = action.payload.page_size || 10;
				state.error = null;
			})
			.addCase(fetchRolesThunk.rejected, (state, action) => {
				state.isLoading = false;
				state.roles = [];
				state.error = action.payload || "An unknown error occurred.";
			})
			.addCase(createRoleThunk.pending, (state) => {
				state.isCreating = true;
				state.createError = null;
			})
			.addCase(createRoleThunk.fulfilled, (state, action) => {
				state.isCreating = false;
			})
			.addCase(createRoleThunk.rejected, (state, action) => {
				state.isCreating = false;
				state.createError = action.payload || "An unknown creation error occurred.";
			})
			.addCase(editRoleThunk.pending, (state) => {
				state.isEditing = true;
				state.editError = null;
			})
			.addCase(editRoleThunk.fulfilled, (state, action) => {
				state.isEditing = false;
			})
			.addCase(editRoleThunk.rejected, (state, action) => {
				state.isEditing = false;
				state.editError = action.payload || "An unknown creation error occurred.";
			});
	},
});
export const {setFilter: setFilter, resetFilters: resetFilters} = roleSlice.actions;

export default roleSlice.reducer;
