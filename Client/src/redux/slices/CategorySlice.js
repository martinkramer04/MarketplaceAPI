import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const fetchCategories = createAsyncThunk(
    'categories/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/api/categories');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchCategoryById = createAsyncThunk(
    'categories/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/categories/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const createCategory = createAsyncThunk(
    'categories/create',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post('/api/categories', payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const updateCategory = createAsyncThunk(
    'categories/update',
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/api/categories/${id}`, payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'categories/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/api/categories/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const CategorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        selectedCategory: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearSelectedCategory: (state) => { state.selectedCategory = null; },
        clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchCategories.fulfilled, (state, action) => { state.loading = false; state.categories = action.payload; })
            .addCase(fetchCategories.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchCategoryById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchCategoryById.fulfilled, (state, action) => { state.loading = false; state.selectedCategory = action.payload; })
            .addCase(fetchCategoryById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(createCategory.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createCategory.fulfilled, (state, action) => { state.loading = false; state.categories.push(action.payload); })
            .addCase(createCategory.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(updateCategory.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.categories.findIndex(c => c.id === action.payload.id);
                if (index !== -1) state.categories[index] = action.payload;
            })
            .addCase(updateCategory.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(deleteCategory.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter(c => c.id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
    }
});

export const { clearSelectedCategory, clearError } = CategorySlice.actions;
export default CategorySlice.reducer;