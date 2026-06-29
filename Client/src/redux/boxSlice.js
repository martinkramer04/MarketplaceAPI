import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosConfig";

export const fetchBoxes = createAsyncThunk("boxes/fetchAvailable", async () => {
  const { data } = await api.get("/api/boxes/available");
  return data;
});

export const updateBox = createAsyncThunk(
  "boxes/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/boxes/${id}`, payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
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
    validating: false,
    cartValidation: null,
  },
  reducers: {
    clearCartValidation: (state) => {
      state.cartValidation = null;
    },
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

      .addCase(updateBox.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBox.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateBox.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
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

export const { clearCartValidation } = boxSlice.actions;
export default boxSlice.reducer;
