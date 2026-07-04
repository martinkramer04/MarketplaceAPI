import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosConfig";

export const fetchAdminDashboard = createAsyncThunk(
  "dashboard/fetchAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/dashboard/admin");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const fetchProviderDashboard = createAsyncThunk(
  "dashboard/fetchProvider",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/dashboard/provider");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    admin: null,
    adminStatus: "idle",
    adminError: null,
    provider: null,
    providerStatus: "idle",
    providerError: null,
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.adminStatus = "loading";
        state.adminError = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.adminStatus = "succeeded";
        state.admin = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.adminStatus = "failed";
        state.adminError = action.payload;
      })

      .addCase(fetchProviderDashboard.pending, (state) => {
        state.providerStatus = "loading";
        state.providerError = null;
      })
      .addCase(fetchProviderDashboard.fulfilled, (state, action) => {
        state.providerStatus = "succeeded";
        state.provider = action.payload;
      })
      .addCase(fetchProviderDashboard.rejected, (state, action) => {
        state.providerStatus = "failed";
        state.providerError = action.payload;
      });
  },
});


export default dashboardSlice.reducer;
