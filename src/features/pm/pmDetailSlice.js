import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// 💡 NOTE: Replace 'api/pm/getDetail' with your actual API endpoint path
// 💡 NOTE: Replace 'fetchPmDetailApi' with your actual API calling function
import { getDetailPM } from "./api";

// --- Thunk for fetching PM detail ---
export const fetchPMDetailThunk = createAsyncThunk(
    "pmDetail/fetchPMDetail",
    async (pmId, { rejectWithValue }) => {
        try {
            // Placeholder API call
            const params = {
                pm_id: pmId
            }
            const response = await getDetailPM(params);
            return response;

            // Mock implementation for demonstration
            // In a real app, this would be an async HTTP request
            // const mockData = {
            //     id: pmId,
            //     description: "Initial setup and configuration of vendor portal.",
            //     solution: "Deployed new vendor API and updated database schemas.",
            //     type: "Deployment",
            //     pic_name: "Alice Johnson",
            //     pic_email: "alice@example.com",
            //     pic_unit: "IT Infrastructure",
            //     project_date: "2025-10-01T00:00:00Z",
            //     completion_date: "2025-10-05T00:00:00Z",
            //     created_at: "2025-09-28T10:00:00Z",
            //     created_by: "System Admin",
            //     updated_at: "2025-10-05T12:30:00Z",
            //     updated_by: "Alice Johnson",
            //     verified_at: "2025-10-06T09:00:00Z",
            //     verified_by: "Bob Manager",
            //     is_verified: true, // true, false, or null/undefined
            // };
            // return mockData;

        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// --- Slice Definition ---
const pmDetailSlice = createSlice({
    name: "pmDetail",
    initialState: {
        data: null,
        project_data: null,
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPMDetailThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPMDetailThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload.project_maintenance;
                state.project_data = action.payload.project;
            })
            .addCase(fetchPMDetailThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to fetch PM detail.";
            });
    },
});

export default pmDetailSlice.reducer;