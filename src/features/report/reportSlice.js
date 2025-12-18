import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getReportList, getVendorList } from './api'; // Added getVendorsList here

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

// // 1. Existing Thunk for Downloading/Fetching the Report
// export const fetchReportThunk = createAsyncThunk(
//     'reports/fetchReport',
//     async (filters, { rejectWithValue }) => {
//         try {
//             const data = await getReportList(filters);
//             return data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || 'Failed to retrieve report.');
//         }
//     }
// );
export const fetchReportThunk = createAsyncThunk(
    'reports/fetchReport',
    async (filters, { rejectWithValue }) => {
        try {
            const response = await getReportList(filters);
            const data = response.data;

            if (!data || data.length === 0) {
                return rejectWithValue("No data found for the selected filters.");
            }

            const headers = Object.keys(data[0]);

            const csvContent = [
                headers.join(','), 
                ...data.map(row => headers.map(fieldName => {
                    let value = row[fieldName];

                    // ⭐️ SPECIAL FIX FOR NOTE COLUMN (JSON LIST)
                    if (fieldName === 'note' && value) {
                        try {
                            // If it's a string that looks like JSON, parse it
                            const parsedNote = typeof value === 'string' ? JSON.parse(value) : value;
                            
                            // If it's a list, join it with semicolons or newlines
                            if (Array.isArray(parsedNote)) {
                                value = parsedNote.map(item => 
                                    typeof item === 'object' ? JSON.stringify(item) : item
                                ).join('; '); // Semicolons work best inside CSV cells
                            } else if (typeof parsedNote === 'object') {
                                value = JSON.stringify(parsedNote);
                            }
                        } catch (e) {
                            // If parsing fails, just use the raw value
                            value = String(value);
                        }
                    }

                    // Handle null/undefined
                    const finalValue = value ?? "";
                    
                    // Escape double quotes and wrap in quotes for CSV safety
                    const stringValue = String(finalValue).replace(/"/g, '""');
                    return `"${stringValue}"`;
                }).join(','))
            ].join('\r\n');

            // Trigger Download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to generate CSV.');
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
                // You can store report results here if you aren't just downloading a file
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