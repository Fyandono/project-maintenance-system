import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {getPMList, postPM, editPM, verifyPM} from "../pm/api";

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
            });
    },
});
export const {setFilter: setFilter, resetFilters: resetFilters, clearPmState: clearPmState} = pmSlice.actions;
export default pmSlice.reducer;