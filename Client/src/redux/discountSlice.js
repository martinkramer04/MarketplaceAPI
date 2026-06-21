import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosConfig";

export const validateDiscount = createAsyncThunk(
  "discount/validate",
  async (code, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/discounts/code/${code}`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.status === 404
          ? "Código inválido. Intentá con otro."
          : "Error al validar el cupón. Intentá de nuevo."
      );
    }
  }
);

const discountSlice = createSlice({
  name: "discount",
  initialState: {
    discount: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearDiscount(state) {
      state.discount = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.discount = null;
      })
      .addCase(validateDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.discount = action.payload;
      })
      .addCase(validateDiscount.rejected, (state, action) => {
        state.loading = false;
        state.discount = null;
        state.error = action.payload;
      });
  },
});

export const { clearDiscount } = discountSlice.actions;
export default discountSlice.reducer;