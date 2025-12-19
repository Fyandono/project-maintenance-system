import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getPMList, postPM, editPM, verifyPM, getReportList} from "../pm/api";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const initialState = {extraData: null, 
    pms: [], 
    totalPage: 1, 
    currentPage: 1, 
    pageSize: 10,
    filterProjectId: null, 
    isLoading: false,
    error: null, 
    isCreating: false, 
    createError: null, 
    isVerifying: false, 
    verifyError: null};

export const fetchPMSThunk = createAsyncThunk("pms/fetchPms", async (filters, {rejectWithValue: rejectWithValue}) => {
    try {
        const data = await getPMList(filters);
        return data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to retrieve PM list.");
    }
});

export const createPMthunk = createAsyncThunk("pms/createPM", async (data, {rejectWithValue: rejectWithValue}) => {
    try {
        const newPM = await postPM(data);
        return newPM;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to create PM.");
    }
});

export const editPMThunk = createAsyncThunk("pms/editPM", async (data, {rejectWithValue: rejectWithValue}) => {
    try {
        const edittedPM = await editPM(data);
        return edittedPM;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to edit PM.");
    }
});

export const verifyPMthunk = createAsyncThunk("pms/verifyPM", async (data, {rejectWithValue: rejectWithValue}) => {
    try {
        // Renaming the returned result to avoid shadowing the API function name
        const verificationResult = await verifyPM(data); 
        return verificationResult;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to verify PM.");
    }
});


// 1. Existing Thunk for Downloading/Fetching the Report
export const fetchReportThunk = createAsyncThunk(
    "pms/fetchReport",
    async (filters, { rejectWithValue }) => {
        try {
            // 1. Fetch the data from your API
            const response = await getReportList(filters); 
            const data = response.data; // Assuming this is your array of vendors

            // 2. Create the Excel Workbook
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("PM Report");

            // 3. Define Columns (Adding the ID column)
            worksheet.columns = [
                { header: 'ID', key: 'id', width: 20 },
                { header: 'Task / Description', key: 'pm_description', width: 35 },
                { header: 'Solution', key: 'pm_solution', width: 35 },
                { header: 'Type', key: 'pm_type', width: 15 },
                { header: 'PIC Name', key: 'pic_name', width: 20 },
                { header: 'PIC Email', key: 'pic_email', width: 20 },
                { header: 'PIC Unit', key: 'pic_unit', width: 20 },
                { header: 'Project Date', key: 'pm_project_date', width: 15 },
                { header: 'Completion Date', key: 'pm_completion_date', width: 15 },
                { header: 'Status', key: 'formatted_status', width: 15 },
                { header: 'PM Verified By', key: 'verified_by', width: 15 },
                { header: 'PM Verified At', key: 'verified_at', width: 20 },
                { header: 'PM Created At', key: 'created_at', width: 20 },
                { header: 'PM Created By', key: 'created_by', width: 20 },
                { header: 'PM Updated At', key: 'updated_at', width: 20 },
                { header: 'PM Updated By', key: 'updated_by', width: 20 },
                { header: 'Note', key: 'note', width: 40 },
            ];

            // Process rows and format the Note JSON
            data.forEach((row) => {
                console.log(row.is_verified);
                let statusText = "On Progress";

                if (row.is_verified === true) {
                    statusText = "Verified";
                } else if (row.is_verified === false) {
                    statusText = "Need Revision";
                }

                worksheet.addRow({
                    ...row,
                    formatted_status: statusText, 
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
            saveAs(blob, `PM_Report_${new Date().toISOString().slice(0,10)}.xlsx`);

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const pmSlice = createSlice({
    name: "pms",
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
            state.filterProjectId = initialState.filterProjectId;
            state.currentPage = initialState.currentPage;
            state.pageSize = initialState.pageSize;
        },
        clearPmState: (state) => {
            state.filterProjectId = null;
            state.filterDescription = null;
            state.filterStartDate = null;
            state.filterEndDate = null;
            state.filterPMType = null;
            state.filterPMStatus = null;
            state.pms = [];
            state.totalPage = 1;
            state.currentPage = 1;
            state.pageSize = 10;
            state.isLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPMSThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPMSThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.extraData = action.payload.extra_data.project || null;
                state.pms = action.payload.data || [];
                state.totalPage = action.payload.total_pages || 1;
                state.currentPage = action.payload.page || 1;
                state.pageSize = action.payload.page_size || 10;
                state.error = null;
            })
            .addCase(fetchPMSThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.extraData = null;
                state.pms = [];
                state.error = action.payload || "An unknown error occurred.";
            })

            // CREATE PM
            .addCase(createPMthunk.pending, (state) => {
                state.isCreating = true;
                state.createError = null;
            })
            .addCase(createPMthunk.fulfilled, (state, action) => {
                state.isCreating = false;
            })
            .addCase(createPMthunk.rejected, (state, action) => {
                state.isCreating = false;
                state.createError = action.payload || "An unknown creation error occurred.";
            })
            
            // Verify PM (FIX: Using verifyPMthunk instead of verifyPM)
            .addCase(verifyPMthunk.pending, (state) => {
                state.isVerifying = true;
                state.verifyError = null;
            })
            .addCase(verifyPMthunk.fulfilled, (state, action) => {
                state.isVerifying = false;
                
                // Optimistically update the single PM item in the list
                const index = state.pms.findIndex(pm => pm.id === action.payload.id);
                if (index !== -1) {
                    state.pms[index] = action.payload; // Replace with the updated PM item
                }
            })
            .addCase(verifyPMthunk.rejected, (state, action) => {
                state.isVerifying = false;
                state.verifyError = action.payload || "An unknown verifying error occurred.";
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
export const {setFilter: setFilter, resetFilters: resetFilters, clearPmState: clearPmState} = pmSlice.actions;
export default pmSlice.reducer;