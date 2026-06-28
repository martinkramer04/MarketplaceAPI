import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosConfig";

export const fetchBoxes = createAsyncThunk("/api/boxes", async () => {
  const { data } = await api.get("/api/boxes");
  return data;
});

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
