import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getUsersList, postUser, putUser, getReportList} from "../user/api";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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

export const fetchReportThunk = createAsyncThunk(
	"units/fetchReport",
	async (filters, { rejectWithValue }) => {
		try {
			// 1. Fetch the data from your API
			const response = await getReportList(filters); 
			const data = response.data;

			// 2. Create the Excel Workbook
			const workbook = new ExcelJS.Workbook();
			const worksheet = workbook.addWorksheet("User Report");

			// 3. Define Columns (Adding the ID column)
			worksheet.columns = [
				{ header: "ID", key: "id", width: 30 },
				{ header: "Name", key: "name", width: 30 },
				{ header: "Username", key: "username", width: 50 },
				{ header: "Role", key: "role", width: 30 },
				{ header: "Is Active", key: "is_active", width: 30 },
				{ header: "Created At", key: "created_at", width: 30 },
				{ header: "Created By", key: "created_by", width: 30 },
				{ header: "Updated At", key: "updated_at", width: 30 },
				{ header: "Updated By", key: "updated_by", width: 30 },
			];

			// 4. Process rows and force Note to be raw string
			data.forEach((row) => {
				worksheet.addRow({
					...row
				});
			});

			// Style the header
			worksheet.getRow(1).font = { bold: true };
			worksheet.getRow(1).fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: 'FFE0E0E0' }
					};
			// 5. Generate Buffer and Trigger Download
			const buffer = await workbook.xlsx.writeBuffer();
			const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
			saveAs(blob, `User_Report_${new Date().toISOString().slice(0,10)}.xlsx`);

			return data;
		} catch (error) {
			return rejectWithValue(error.message);
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

			// Create
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

			// Edit
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
			})
			
			// Report
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
export const {setFilter: setFilter, resetFilters: resetFilters} = userSlice.actions;
export default userSlice.reducer;
