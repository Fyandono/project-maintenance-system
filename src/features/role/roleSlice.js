import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getRolesList, postRole, putRole, getReportList} from "./api";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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
export const fetchReportThunk = createAsyncThunk("units/fetchReport", async (filters, {rejectWithValue: rejectWithValue}) => {
	try {
		const response = await getReportList(filters);
		const data = response.data;
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Role Report");
		worksheet.columns = [
			{header: "ID", key: "id", width: 10},
			{header: "Role", key: "name", width: 20},
			{header: "Can Get Role", key: "can_get_role", width: 15},
			{header: "Can Add Role", key: "can_add_role", width: 15},
			{header: "Can Edit Role", key: "can_edit_role", width: 15},
			{header: "Can Get User", key: "can_get_user", width: 15},
			{header: "Can Add User", key: "can_add_user", width: 15},
			{header: "Can Edit User", key: "can_edit_user", width: 15},
			{header: "Can Get Vendor", key: "can_get_vendor", width: 15},
			{header: "Can Add Vendor", key: "can_add_vendor", width: 15},
			{header: "Can Edit Vendor", key: "can_edit_vendor", width: 15},
			{header: "Can Get Project", key: "can_get_project", width: 15},
			{header: "Can Add Project", key: "can_add_project", width: 15},
			{header: "Can Edit Project", key: "can_edit_project", width: 15},
			{header: "Can Get PM", key: "can_get_pm", width: 15},
			{header: "Can Add PM", key: "can_add_pm", width: 15},
			{header: "Can Edit PM", key: "can_edit_pm", width: 15},
			{header: "Can Verify PM", key: "can_verify_pm", width: 15},
			{header: "Can Get Unit", key: "can_get_unit", width: 15},
			{header: "Can Add Unit", key: "can_add_unit", width: 15},
			{header: "Can Edit Unit", key: "can_edit_unit", width: 15},
			{header: "Is Active", key: "is_active", width: 20},
			{header: "Created At", key: "created_at", width: 20},
			{header: "Created By", key: "created_by", width: 20},
			{header: "Updated At", key: "updated_at", width: 20},
			{header: "Updated By", key: "updated_by", width: 20},
		];
		data.forEach((row) => {
			worksheet.addRow({...row});
		});
		worksheet.getRow(1).font = {bold: true};
		worksheet.getRow(1).fill = {type: "pattern", pattern: "solid", fgColor: {argb: "FFE0E0E0"}};
		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
		saveAs(blob, `Role_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
		return data;
	}
	catch (error) {
		return rejectWithValue(error.message);
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
			})
			.addCase(fetchReportThunk.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchReportThunk.fulfilled, (state, action) => {
				state.isLoading = false;
				state.reportData = action.payload.data || [];
				state.error = null;
			})
			.addCase(fetchReportThunk.rejected, (state, action) => {
				state.isLoading = false;
				state.reportData = [];
				state.error = action.payload || "An unknown error occurred.";
			});
	},
});
export const {setFilter: setFilter, resetFilters: resetFilters} = roleSlice.actions;
export default roleSlice.reducer;
