import React from "react";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getReportList, getVendorList } from './api'; // Added getVendorsList here
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const initialState = {
    // --- Data State ---
    vendors: [], 
    
    // --- Active Report Filters ---
    filterListVendorId: '', 
    filterProjectStartDate: '',
    filterProjectEndDate: '',
    filterCompletionStartDate: '',
    filterCompletionEndDate: '',
    filterPMType: '',
    filterPMStatus: '',

    // --- Status States ---
    isLoading: false,
    vendorsLoading: false, // Added separate loading for vendors
    error: null,
};

// 1. Existing Thunk for Downloading/Fetching the Report
export const fetchReportThunk = createAsyncThunk(
    "reports/fetchReport",
    async (filters, { rejectWithValue }) => {
        try {
            // 1. Fetch the data from your API
            const response = await getReportList(filters); 
            const data = response.data; // Assuming this is your array of vendors

            // 2. Create the Excel Workbook
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Report");

            // 3. Define Columns (Adding the ID column)
            worksheet.columns = [
                { header: 'Vendor', key: 'vendor_name', width: 20 },
                { header: 'Project Name', key: 'project_name', width: 25 },
                { header: 'Project Type', key: 'project_type', width: 25},
                { header: 'Task / Description', key: 'pm_task', width: 35 },
                { header: 'Solution', key: 'pm_solution', width: 35 },
                { header: 'Type', key: 'pm_type', width: 15 },
                { header: 'PIC Name', key: 'pic_name', width: 20 },
                { header: 'PIC Email', key: 'pic_email', width: 20 },
                { header: 'PIC Unit', key: 'pic_unit', width: 20 },
                { header: 'Project Date', key: 'pm_project_date', width: 15 },
                { header: 'Completion Date', key: 'pm_completion_date', width: 15 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'PM Verified By', key: 'pm_verified_by', width: 15 },
                { header: 'PM Verified At', key: 'pm_verified_at', width: 20 },
                { header: 'PM Created At', key: 'pm_created_at', width: 20 },
                { header: 'PM Created By', key: 'pm_created_by', width: 20 },
                { header: 'PM Updated At', key: 'pm_updated_at', width: 20 },
                { header: 'PM Updated By', key: 'pm_updated_by', width: 20 },
                { header: 'Note', key: 'note', width: 40 },
            ];

            // Process rows and format the Note JSON
            data.forEach((row) => {
                worksheet.addRow({
                    ...row,
                    note: String(row.note || "")
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
            saveAs(blob, `Report_${new Date().toISOString().slice(0,10)}.xlsx`);

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// ⭐️ 2. NEW Thunk: Fetch Vendors for the Checkbox List
export const fetchVendorsThunk = createAsyncThunk(
    'reports/fetchVendors',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getVendorList(); // Fetches all vendors for the filters
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to retrieve vendors.');
        }
    }
);

const reportSlice = createSlice({
    name: 'reports', 
    initialState,
    reducers: {
        setFilter: (state, action) => {
            const { name, value } = action.payload;
            if (Object.prototype.hasOwnProperty.call(state, name)) {
                state[name] = value;
            }
            state.error = null;
        },
        resetFilters: (state) => {
            state.filterListVendorId = initialState.filterListVendorId;
            state.filterProjectStartDate = initialState.filterProjectStartDate;
            state.filterProjectEndDate = initialState.filterProjectEndDate;
            state.filterCompletionStartDate = initialState.filterCompletionStartDate;
            state.filterCompletionEndDate = initialState.filterCompletionEndDate;
            state.filterPMType = initialState.filterPMType;
            state.filterPMStatus = initialState.filterPMStatus;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle Report Fetching
            .addCase(fetchReportThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchReportThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reportData = action.payload.data || [];
            })
            .addCase(fetchReportThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // ⭐️ Handle Vendor List Fetching
            .addCase(fetchVendorsThunk.pending, (state) => {
                state.vendorsLoading = true;
            })
            .addCase(fetchVendorsThunk.fulfilled, (state, action) => {
                state.vendorsLoading = false;
                state.vendors = action.payload.data || [];
            })
            .addCase(fetchVendorsThunk.rejected, (state, action) => {
                state.vendorsLoading = false;
                state.error = action.payload;
            });
    },
});

export const { setFilter, resetFilters } = reportSlice.actions;
export default reportSlice.reducer;