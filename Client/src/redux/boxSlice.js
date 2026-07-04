import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosConfig";

export const fetchBoxes = createAsyncThunk("boxes/fetchAll", async () => {
  const { data } = await api.get("/api/boxes");
  return data;
});

export const fetchBoxesAvailable = createAsyncThunk("boxes/fetchAvailable", async () => {
  const { data } = await api.get("/api/boxes/available");
  return data;
});

export const fetchBoxesByUser = createAsyncThunk(
  "boxes/fetchByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/boxes/user/${userId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const adjustBoxStock = createAsyncThunk(
  "boxes/adjustStock",
  async ({ id, amount }, { rejectWithValue }) => {
    try {
      const isReduction = amount < 0;
      const absoluteAmount = Math.abs(amount);
      const endpoint = isReduction
        ? `/api/boxes/${id}/ReduceStock`
        : `/api/boxes/${id}/stock`;
      const { data } = await api.put(endpoint, { amount: absoluteAmount });
      return { id, amount: absoluteAmount, isReduction, stock: data?.stock };
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
      });
    }
  },
);

export const updateBox = createAsyncThunk(
  "boxes/update",
  async ({ id, fields, images = [], keepImageIds = [] }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        if (value != null && value !== "") formData.append(key, value);
      });
      images.forEach((img) => formData.append("images", img));
      keepImageIds.forEach((imgId) => formData.append("keepImageIds", imgId));
      const { data } = await api.put(`/api/boxes/${id}`, formData);
      return data;
    } catch (err) {
      return rejectWithValue({
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
      });
    }
  },
);

export const validateCart = createAsyncThunk(
  "boxes/validateCart",
  async (items, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/boxes/validate-cart", { items });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const boxSlice = createSlice({
  name: "boxes",
  initialState: {
    items: [],
    loading: false,
    error: null,
    status: "idle",
    providerItems: [],
    providerLoading: false,
    providerError: null,
    providerStatus: "idle",
    validating: false,
    cartValidation: null,
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoxes.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBoxes.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchBoxes.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchBoxesAvailable.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBoxesAvailable.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchBoxesAvailable.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchBoxesByUser.pending, (state) => {
        state.providerLoading = true;
        state.providerStatus = "loading";
        state.providerError = null;
      })
      .addCase(fetchBoxesByUser.fulfilled, (state, action) => {
        state.providerLoading = false;
        state.providerStatus = "succeeded";
        state.providerItems = action.payload;
      })
      .addCase(fetchBoxesByUser.rejected, (state, action) => {
        state.providerLoading = false;
        state.providerStatus = "failed";
        state.providerError = action.payload;
      })

      .addCase(updateBox.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBox.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        const providerIndex = state.providerItems.findIndex((b) => b.id === action.payload.id);
        if (providerIndex !== -1) state.providerItems[providerIndex] = action.payload;
      })
      .addCase(updateBox.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(adjustBoxStock.pending, (state) => {
        state.providerLoading = true;
        state.providerError = null;
      })
      .addCase(adjustBoxStock.fulfilled, (state, action) => {
        state.providerLoading = false;
        const { id, amount, isReduction, stock } = action.payload;
        const applyStock = (arr) => {
          const index = arr.findIndex((b) => b.id === id);
          if (index !== -1) {
            const current = arr[index];
            const newStock = stock ?? (isReduction ? current.stock - amount : current.stock + amount);
            arr[index] = { ...current, stock: newStock };
          }
        };
        applyStock(state.items);
        applyStock(state.providerItems);
      })
      .addCase(adjustBoxStock.rejected, (state, action) => {
        state.providerLoading = false;
        state.providerError = action.payload;
      })

      .addCase(validateCart.pending, (state) => {
        state.validating = true;
        state.cartValidation = null;
      })
      .addCase(validateCart.fulfilled, (state, action) => {
        state.validating = false;
        state.cartValidation = action.payload;
      })
      .addCase(validateCart.rejected, (state) => {
        state.validating = false;
        state.cartValidation = null;
      });
  },
});


export default boxSlice.reducer;
