import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getVendorsList, postVendor, putVendor} from "../vendor/api";
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
			});
	},
});
export const {setFilter: setFilter, resetFilters: resetFilters} = vendorSlice.actions;
export default vendorSlice.reducer;
