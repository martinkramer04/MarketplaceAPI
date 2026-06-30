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
export const fetchDiscounts = createAsyncThunk(
  "discount/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/discounts"); // Endpoint de tu AdminController
      return data;
    } catch (err) {
      return rejectWithValue("Error al cargar los descuentos.");
    }
  }
);

export const createDiscount = createAsyncThunk(
  "discount/create",
  async (discountData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/discounts", discountData);
      return data;
    } catch (err) {
      return rejectWithValue("Error al crear el descuento.");
    }
  }
);

const discountSlice = createSlice({
  name: "discount",
  initialState: {
    discount: null,      // Para el checkout del cliente
    discounts: [],       // 👈 Agregamos la lista para el Admin
    loading: false,
    error: null,
    status: "idle",      // 👈 Agregamos el flag de control de estado
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
      // Validación tradicional de cliente
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
      })

      // 👇 AGREGAMOS LAS ACCIONES DE ADMIN:
      .addCase(fetchDiscounts.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDiscounts.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.discounts = action.payload; // Guardamos en la lista de discounts
      })
      .addCase(fetchDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(createDiscount.fulfilled, (state, action) => {
        state.discounts.push(action.payload); // Insertamos el nuevo descuento en la lista
      });
  },
});

export const { clearDiscount } = discountSlice.actions;
export default discountSlice.reducer;