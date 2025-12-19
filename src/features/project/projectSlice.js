import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProjectsList, postProject, putProject, getReportList} from './api'; 
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// --- Initial State ---
const initialState = {
    extraData: null,
    projects: [],
    totalPage: 1,
    currentPage: 1,
    pageSize: 10,
    filterVendorId: null,
    filterName: '',
    isLoading: false,
    error: null,
    isCreating: false,
    createError: null, 
    isEditing: false,
    editError: null, 
};

// --- Async Thunks ---

// 1. Fetch Projects (Read)
export const fetchProjectsThunk = createAsyncThunk(
    'projects/fetchProjects',
    async (filters, { rejectWithValue }) => {
        try {
            const data = await getProjectsList(filters);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to retrieve project list.');
        }
    }
);

// 2. Create Project (Create)
export const createProjectThunk = createAsyncThunk(
    'projects/createProject',
    async (projectData, { rejectWithValue }) => {
        try {
            const newProject = await postProject(projectData);
            return newProject;
        } catch (error) {
            // Use response data for detailed error message if available
            return rejectWithValue(error.response?.data?.message || 'Failed to create project.');
        }
    }
);

// 3. Edit Project (Edit)
export const editProjectThunk = createAsyncThunk(
    'projects/editProject',
    async (projectData, { rejectWithValue }) => {
        try {
            const editProject = await putProject(projectData);
            return editProject;
        } catch (error) {
            // Use response data for detailed error message if available
            return rejectWithValue(error.response?.data?.message || 'Failed to create project.');
        }
    }
);

export const fetchReportThunk = createAsyncThunk(
    "projects/fetchReport",
    async (filters, { rejectWithValue }) => {
        try {
            // 1. Fetch the data from your API
            const response = await getReportList(filters); 
            const data = response.data; // Assuming this is your array of vendors

            // 2. Create the Excel Workbook
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Project Report");

            // 3. Define Columns (Adding the ID column)
            worksheet.columns = [
                { header: 'Vendor', key: 'vendor_name', width: 20 },
                { header: 'Project Name', key: 'name', width: 25 },
                { header: 'description', key: 'description', width: 35 },
                { header: 'Project Type', key: 'project_type', width: 20 },
                { header: 'PIC Email', key: 'pic_email', width: 20 },
                { header: 'PIC Name', key: 'pic_name', width: 20 },
                { header: 'PIC Unit', key: 'pic_unit', width: 20 },
                { header: 'Count PM Uploaded', key: 'count_pm_uploaded', width: 20 },
                { header: 'Count PM Verified', key: 'count_pm_verified', width: 20 },
                { header: 'Count PM Unverified', key: 'count_pm_unverified', width: 20 },
                { header: 'Created At', key: 'created_at', width: 20 },
                { header: 'Created By', key: 'created_by', width: 20 },
                { header: 'Updated At', key: 'updated_at', width: 20 },
                { header: 'Updated By', key: 'updated_by', width: 20 },
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
            saveAs(blob, `Project_Report_${new Date().toISOString().slice(0,10)}.xlsx`);

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// --- Slice Definition ---
const projectSlice = createSlice({
    name: 'projects',
    initialState,

    // Synchronous Reducers
    reducers: {
        setFilter: (state, action) => {
            const { name, value } = action.payload;
            state[name] = value;
            state.error = null;

            if (name !== 'currentPage') {
                state.currentPage = 1;
            }
        },

        resetFilters: (state) => {
            state.filterName = initialState.filterName;
            state.currentPage = initialState.currentPage;
            state.pageSize = initialState.pageSize;
        }
    },

    // Handling the Asynchronous Thunks
    extraReducers: (builder) => {
        builder
            // --- FETCH PROJECTS (READ) ---
            .addCase(fetchProjectsThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProjectsThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.extraData = action.payload.extra_data?.vendor || null;
                state.projects = action.payload.data || [];
                state.totalPage = action.payload.total_pages || 1;
                state.currentPage = action.payload.page || 1;
                state.pageSize = action.payload.page_size || 10;
                state.error = null;
            })
            .addCase(fetchProjectsThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.extraData = null;
                state.error = action.payload || 'An unknown error occurred.';
            })

            // --- CREATE PROJECT (WRITE) ---
            .addCase(createProjectThunk.pending, (state) => {
                state.isCreating = true;
                state.createError = null;
            })
            .addCase(createProjectThunk.fulfilled, (state, action) => {
                state.isCreating = false;
            })
            .addCase(createProjectThunk.rejected, (state, action) => {
                state.isCreating = false;
                state.createError = action.payload || 'An unknown creation error occurred.';
            })

            // --- EDIT PROJECT (EDIT) ---
            .addCase(editProjectThunk.pending, (state) => {
                state.isEditing = true;
                state.editError = null;
            })
            .addCase(editProjectThunk.fulfilled, (state, action) => {
                state.isEditing = false;
            })
            .addCase(editProjectThunk.rejected, (state, action) => {
                state.isEditing = false;
                state.editError = action.payload || 'An unknown creation error occurred.';
            })

            // report
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

export const { setFilter, resetFilters } = projectSlice.actions;
export default projectSlice.reducer;