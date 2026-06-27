import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const fetchOrders = createAsyncThunk(
    'orders/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/api/orders');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchOrderById = createAsyncThunk(
    'orders/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/orders/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchOrdersByUser = createAsyncThunk(
    'orders/fetchByUser',
    async (userId, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/orders/user/${userId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchOrderDetails = createAsyncThunk(
    'orders/fetchDetails',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/api/orders/${id}/details`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const createOrder = createAsyncThunk(
    'orders/create',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post('/api/orders', payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const updateOrder = createAsyncThunk(
    'orders/update',
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/api/orders/${id}`, payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const deleteOrder = createAsyncThunk(
    'orders/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/api/orders/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const OrderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        selectedOrder: null,
        orderDetails: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearSelectedOrder: (state) => { state.selectedOrder = null; },
        clearOrderDetails: (state) => { state.orderDetails = []; },
        clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
            .addCase(fetchOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchOrderById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchOrderById.fulfilled, (state, action) => { state.loading = false; state.selectedOrder = action.payload; })
            .addCase(fetchOrderById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchOrdersByUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchOrdersByUser.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
            .addCase(fetchOrdersByUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchOrderDetails.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => { state.loading = false; state.orderDetails = action.payload; })
            .addCase(fetchOrderDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.orders.push(action.payload); })
            .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(updateOrder.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.orders.findIndex(o => o.id === action.payload.id);
                if (index !== -1) state.orders[index] = action.payload;
            })
            .addCase(updateOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(deleteOrder.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.filter(o => o.id !== action.payload);
            })
            .addCase(deleteOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
    }
});

export const { clearSelectedOrder, clearOrderDetails, clearError } = OrderSlice.actions;
export default OrderSlice.reducer;