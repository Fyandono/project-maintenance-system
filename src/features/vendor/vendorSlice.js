import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getVendorsList, postVendor, putVendor, getReportVendor} from "../vendor/api";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const initialState = {vendors: [], totalPage: 1, currentPage: 1, pageSize: 10, filterName: "", isLoading: false, error: null};

export const fetchVendorsThunk = createAsyncThunk("vendors/fetchVendors", async (filters, {rejectWithValue: rejectWithValue, getState: getState}) => {
	try {
		const data = await getVendorsList(filters);
		return data;
	}
	catch (error) {
		return rejectWithValue(error.response?.data?.message || "Failed to retrieve vendor list.");
	}
});

export const fetchReportThunk = createAsyncThunk(
    "vendors/fetchReport",
    async (filters, { rejectWithValue }) => {
        try {
            // 1. Fetch the data from your API
            const response = await getReportVendor(filters); 
            const data = response.data; // Assuming this is your array of vendors

            // 2. Create the Excel Workbook
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Vendor Report");

            // 3. Define Columns (Adding the ID column)
            worksheet.columns = [
                { header: "ID", key: "id", width: 10 },
                { header: "Vendor", key: "name", width: 30 },
                { header: "Address", key: "address", width: 50 },
				{ header: "Email", key: "email", width: 30 },
				{ header: "Phone Number", key: "phone_number", width: 30 },
				{ header: "Count Project", key: "count_project", width: 20 },
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
            saveAs(blob, `Vendor_Report_${new Date().toISOString().slice(0,10)}.xlsx`);

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 2. Create Vendor (Create)
export const createVendorThunk = createAsyncThunk(
    'vendors/createVendor',
    async (vendorData, { rejectWithValue }) => {
        try {
            const newVendor = await postVendor(vendorData);
            return newVendor;
        } catch (error) {
            // Use response data for detailed error message if available
            return rejectWithValue(error.response?.data?.message || 'Failed to create vendor.');
        }
    }
);

// 3. Edit Vendor (Edit)
export const editVendorThunk = createAsyncThunk(
    'vendors/editVendor',
    async (vendorData, { rejectWithValue }) => {
        try {
            const editVendor = await putVendor(vendorData);
            return editVendor;
        } catch (error) {
            // Use response data for detailed error message if available
            return rejectWithValue(error.response?.data?.message || 'Failed to create vendor.');
        }
    }
);

const vendorSlice = createSlice({
	name: "vendors",
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
			.addCase(fetchVendorsThunk.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchVendorsThunk.fulfilled, (state, action) => {
				state.isLoading = false;
				state.vendors = action.payload.data || [];
				state.totalPage = action.payload.total_pages || 1;
				state.currentPage = action.payload.page || 1;
				state.pageSize = action.payload.page_size || 10;
				state.error = null;
			})
			.addCase(fetchVendorsThunk.rejected, (state, action) => {
				state.isLoading = false;
				state.vendors = [];
				state.error = action.payload || "An unknown error occurred.";
			})
			.addCase(createVendorThunk.pending, (state) => {
				state.isCreating = true;
				state.createError = null;
			})
			.addCase(createVendorThunk.fulfilled, (state, action) => {
				state.isCreating = false;
			})
			.addCase(createVendorThunk.rejected, (state, action) => {
				state.isCreating = false;
				state.createError = action.payload || "An unknown creation error occurred.";
			})
			.addCase(editVendorThunk.pending, (state) => {
				state.isEditing = true;
				state.editError = null;
			})
			.addCase(editVendorThunk.fulfilled, (state, action) => {
				state.isEditing = false;
			})
			.addCase(editVendorThunk.rejected, (state, action) => {
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
export const {setFilter: setFilter, resetFilters: resetFilters} = vendorSlice.actions;
export default vendorSlice.reducer;
