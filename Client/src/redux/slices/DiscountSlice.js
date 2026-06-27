import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const fetchDiscounts = createAsyncThunk(
    'discounts/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/api/discounts');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchDiscountById = createAsyncThunk(
    'discounts/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/discounts/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchDiscountByCode = createAsyncThunk(
    'discounts/fetchByCode',
    async (code, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/discounts/code/${code}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchActiveDiscounts = createAsyncThunk(
    'discounts/fetchActive',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/api/discounts/active');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const createDiscount = createAsyncThunk(
    'discounts/create',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post('/api/discounts', payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const updateDiscount = createAsyncThunk(
    'discounts/update',
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/api/discounts/${id}`, payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const deleteDiscount = createAsyncThunk(
    'discounts/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/api/discounts/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const DiscountSlice = createSlice({
    name: 'discounts',
    initialState: {
        discounts: [],
        selectedDiscount: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearSelectedDiscount: (state) => { state.selectedDiscount = null; },
        clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDiscounts.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchDiscounts.fulfilled, (state, action) => { state.loading = false; state.discounts = action.payload; })
            .addCase(fetchDiscounts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchDiscountById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchDiscountById.fulfilled, (state, action) => { state.loading = false; state.selectedDiscount = action.payload; })
            .addCase(fetchDiscountById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchDiscountByCode.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchDiscountByCode.fulfilled, (state, action) => { state.loading = false; state.selectedDiscount = action.payload; })
            .addCase(fetchDiscountByCode.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchActiveDiscounts.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchActiveDiscounts.fulfilled, (state, action) => { state.loading = false; state.discounts = action.payload; })
            .addCase(fetchActiveDiscounts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(createDiscount.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createDiscount.fulfilled, (state, action) => { state.loading = false; state.discounts.push(action.payload); })
            .addCase(createDiscount.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(updateDiscount.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateDiscount.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.discounts.findIndex(d => d.id === action.payload.id);
                if (index !== -1) state.discounts[index] = action.payload;
            })
            .addCase(updateDiscount.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(deleteDiscount.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteDiscount.fulfilled, (state, action) => {
                state.loading = false;
                state.discounts = state.discounts.filter(d => d.id !== action.payload);
            })
            .addCase(deleteDiscount.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
    }
});

export const { clearSelectedDiscount, clearError } = DiscountSlice.actions;
export default DiscountSlice.reducer;