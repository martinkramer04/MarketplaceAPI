import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";

export const fetchPaymentMethods = createAsyncThunk(
  "paymentMethods/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/paymentMethods");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const fetchPaymentMethodById = createAsyncThunk(
  "paymentMethods/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/paymentMethods/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const createPaymentMethod = createAsyncThunk(
  "paymentMethods/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/paymentMethods", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const updatePaymentMethod = createAsyncThunk(
  "paymentMethods/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/paymentMethods/${id}`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deletePaymentMethod = createAsyncThunk(
  "paymentMethods/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/paymentMethods/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const PaymentMethodsSlice = createSlice({
  name: "paymentMethods",
  initialState: {
    paymentMethods: [],
    selectedPaymentMethod: null,
    loading: false,
    error: null,
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods = action.payload;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPaymentMethodById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentMethodById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPaymentMethod = action.payload;
      })
      .addCase(fetchPaymentMethodById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createPaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods.push(action.payload);
      })
      .addCase(createPaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updatePaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.paymentMethods.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) state.paymentMethods[index] = action.payload;
      })
      .addCase(updatePaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deletePaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods = state.paymentMethods.filter(
          (p) => p.id !== action.payload,
        );
      })
      .addCase(deletePaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default PaymentMethodsSlice.reducer;
