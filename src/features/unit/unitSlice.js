import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getUnitsList, postUnit, putUnit, getReportList} from "./api";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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

export const fetchReportThunk = createAsyncThunk(
    "units/fetchReport",
    async (filters, { rejectWithValue }) => {
        try {
            // 1. Fetch the data from your API
            const response = await getReportList(filters); 
            const data = response.data;

            // 2. Create the Excel Workbook
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Unit Report");

            // 3. Define Columns (Adding the ID column)
            worksheet.columns = [
                { header: "ID", key: "id", width: 10 },
                { header: "Name", key: "name", width: 30 },
                { header: "Is Active", key: "is_active", width: 50 },
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
            saveAs(blob, `Unit_Report_${new Date().toISOString().slice(0,10)}.xlsx`);

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

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
