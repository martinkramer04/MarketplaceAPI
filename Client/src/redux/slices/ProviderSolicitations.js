import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const fetchSolicitations = createAsyncThunk(
    'providerSolicitations/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/api/provider-solicitations');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchSolicitationById = createAsyncThunk(
    'providerSolicitations/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/provider-solicitations/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchSolicitationsByUser = createAsyncThunk(
    'providerSolicitations/fetchByUser',
    async (userId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/provider-solicitations/provider/${userId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchSolicitationsByStatus = createAsyncThunk(
    'providerSolicitations/fetchByStatus',
    async (status, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/provider-solicitations/status/${status}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const createSolicitation = createAsyncThunk(
    'providerSolicitations/create',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post('/api/provider-solicitations', payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const updateSolicitation = createAsyncThunk(
    'providerSolicitations/update',
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/api/provider-solicitations/${id}`, payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const deleteSolicitation = createAsyncThunk(
    'providerSolicitations/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/api/provider-solicitations/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const ProviderSolicitationsSlice = createSlice({
    name: 'providerSolicitations',
    initialState: {
        solicitations: [],
        selectedSolicitation: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearSelectedSolicitation: (state) => { state.selectedSolicitation = null; },
        clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSolicitations.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchSolicitations.fulfilled, (state, action) => { state.loading = false; state.solicitations = action.payload; })
            .addCase(fetchSolicitations.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchSolicitationById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchSolicitationById.fulfilled, (state, action) => { state.loading = false; state.selectedSolicitation = action.payload; })
            .addCase(fetchSolicitationById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchSolicitationsByUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchSolicitationsByUser.fulfilled, (state, action) => { state.loading = false; state.solicitations = action.payload; })
            .addCase(fetchSolicitationsByUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchSolicitationsByStatus.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchSolicitationsByStatus.fulfilled, (state, action) => { state.loading = false; state.solicitations = action.payload; })
            .addCase(fetchSolicitationsByStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(createSolicitation.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createSolicitation.fulfilled, (state, action) => { state.loading = false; state.solicitations.push(action.payload); })
            .addCase(createSolicitation.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(updateSolicitation.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateSolicitation.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.solicitations.findIndex(s => s.id === action.payload.id);
                if (index !== -1) state.solicitations[index] = action.payload;
            })
            .addCase(updateSolicitation.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(deleteSolicitation.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteSolicitation.fulfilled, (state, action) => {
                state.loading = false;
                state.solicitations = state.solicitations.filter(s => s.id !== action.payload);
            })
            .addCase(deleteSolicitation.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
    }
});

export const { clearSelectedSolicitation, clearError } = ProviderSolicitationsSlice.actions;
export default ProviderSolicitationsSlice.reducer;