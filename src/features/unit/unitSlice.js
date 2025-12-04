import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getUnitsList, postUnit, putUnit} from "./api";

const initialState = {units: [], totalPage: 1, currentPage: 1, pageSize: 10, filterName: "", isLoading: false, error: null};

export const fetchUnitsThunk = createAsyncThunk("unit/fetchUnits", async (filters, {rejectWithValue: rejectWithValue, getState: getState}) => {
	try {
		console.log(filters);
		const data = await getUnitsList(filters);
		return data;
	}
	catch (error) {
		return rejectWithValue(error.response?.data?.message || "Failed to retrieve unit list.");
	}
});
export const createUnitThunk = createAsyncThunk("unit/createUnit", async (unitData, {rejectWithValue: rejectWithValue}) => {
	try {
		const newUnit = await postUnit(unitData);
		return newUnit;
	}
	catch (error) {
		return rejectWithValue(error.response?.data?.message || "Failed to create unit.");
	}
});
export const editUnitThunk = createAsyncThunk("unit/editUnit", async (unitData, {rejectWithValue: rejectWithValue}) => {
	try {
		const editUnit = await putUnit(unitData);
		return editUnit;
	}
	catch (error) {
		return rejectWithValue(error.response?.data?.message || "Failed to update unit.");
	}
});
const unitSlice = createSlice({
	name: "unit",
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
			.addCase(fetchUnitsThunk.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchUnitsThunk.fulfilled, (state, action) => {
				state.isLoading = false;
				state.units = action.payload.data || [];
				state.totalPage = action.payload.total_pages || 1;
				state.currentPage = action.payload.page || 1;
				state.pageSize = action.payload.page_size || 10;
				state.error = null;
			})
			.addCase(fetchUnitsThunk.rejected, (state, action) => {
				state.isLoading = false;
				state.units = [];
				state.error = action.payload || "An unknown error occurred.";
			})
			.addCase(createUnitThunk.pending, (state) => {
				state.isCreating = true;
				state.createError = null;
			})
			.addCase(createUnitThunk.fulfilled, (state, action) => {
				state.isCreating = false;
			})
			.addCase(createUnitThunk.rejected, (state, action) => {
				state.isCreating = false;
				state.createError = action.payload || "An unknown creation error occurred.";
			})
			.addCase(editUnitThunk.pending, (state) => {
				state.isEditing = true;
				state.editError = null;
			})
			.addCase(editUnitThunk.fulfilled, (state, action) => {
				state.isEditing = false;
			})
			.addCase(editUnitThunk.rejected, (state, action) => {
				state.isEditing = false;
				state.editError = action.payload || "An unknown creation error occurred.";
			});
	},
});
export const {setFilter: setFilter, resetFilters: resetFilters} = unitSlice.actions;

export default unitSlice.reducer;
