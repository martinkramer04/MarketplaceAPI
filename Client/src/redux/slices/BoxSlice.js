import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

// =====================================================================
// THUNKS (llamadas async al backend)
// =====================================================================

export const fetchBoxes = createAsyncThunk(
    'boxes/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/api/boxes');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchAvailableBoxes = createAsyncThunk(
    'boxes/fetchAvailable',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/api/boxes/available');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchBoxById = createAsyncThunk(
    'boxes/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/boxes/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchBoxesByStatus = createAsyncThunk(
    'boxes/fetchByStatus',
    async (status, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/boxes/status/${status}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchBoxesByUser = createAsyncThunk(
    'boxes/fetchByUser',
    async (userId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/boxes/user/${userId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const createBox = createAsyncThunk(
    'boxes/create',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post('/api/boxes', payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const updateBox = createAsyncThunk(
    'boxes/update',
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/api/boxes/${id}`, payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const deleteBox = createAsyncThunk(
    'boxes/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/api/boxes/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// =====================================================================
// SLICE
// =====================================================================

const boxSlice = createSlice({
    name: 'boxes',
    initialState: {
        boxes: [],
        availableBoxes: [],
        selectedBox: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearSelectedBox: (state) => {
            state.selectedBox = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchBoxes
            .addCase(fetchBoxes.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchBoxes.fulfilled, (state, action) => { state.loading = false; state.boxes = action.payload; })
            .addCase(fetchBoxes.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // fetchAvailableBoxes
            .addCase(fetchAvailableBoxes.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAvailableBoxes.fulfilled, (state, action) => { state.loading = false; state.availableBoxes = action.payload; })
            .addCase(fetchAvailableBoxes.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // fetchBoxById
            .addCase(fetchBoxById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchBoxById.fulfilled, (state, action) => { state.loading = false; state.selectedBox = action.payload; })
            .addCase(fetchBoxById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // fetchBoxesByStatus
            .addCase(fetchBoxesByStatus.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchBoxesByStatus.fulfilled, (state, action) => { state.loading = false; state.boxes = action.payload; })
            .addCase(fetchBoxesByStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // fetchBoxesByUser
            .addCase(fetchBoxesByUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchBoxesByUser.fulfilled, (state, action) => { state.loading = false; state.boxes = action.payload; })
            .addCase(fetchBoxesByUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // createBox
            .addCase(createBox.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createBox.fulfilled, (state, action) => { state.loading = false; state.boxes.push(action.payload); })
            .addCase(createBox.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // updateBox
            .addCase(updateBox.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateBox.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.boxes.findIndex(b => b.id === action.payload.id);
                if (index !== -1) state.boxes[index] = action.payload;
            })
            .addCase(updateBox.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // deleteBox
            .addCase(deleteBox.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteBox.fulfilled, (state, action) => {
                state.loading = false;
                state.boxes = state.boxes.filter(b => b.id !== action.payload);
            })
            .addCase(deleteBox.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
    }
});

export const { clearSelectedBox, clearError } = boxSlice.actions;
export default boxSlice.reducer;