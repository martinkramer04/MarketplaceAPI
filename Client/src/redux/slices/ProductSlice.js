import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/api/products');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchProductById = createAsyncThunk(
    'products/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/products/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const createProduct = createAsyncThunk(
    'products/create',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post('/api/products', payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/update',
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/api/products/${id}`, payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/api/products/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const ProductSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        selectedProduct: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearSelectedProduct: (state) => { state.selectedProduct = null; },
        clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.products = action.payload; })
            .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchProductById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchProductById.fulfilled, (state, action) => { state.loading = false; state.selectedProduct = action.payload; })
            .addCase(fetchProductById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(createProduct.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createProduct.fulfilled, (state, action) => { state.loading = false; state.products.push(action.payload); })
            .addCase(createProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(updateProduct.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.products.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.products[index] = action.payload;
            })
            .addCase(updateProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(deleteProduct.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(p => p.id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
    }
});

export const { clearSelectedProduct, clearError } = ProductSlice.actions;
export default ProductSlice.reducer;