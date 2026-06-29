import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosConfig";

export const fetchSolicitations = createAsyncThunk(
  "providerSolicitations/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/provider-solicitations");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const fetchSolicitationById = createAsyncThunk(
  "providerSolicitations/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/provider-solicitations/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const fetchSolicitationsByUser = createAsyncThunk(
  "providerSolicitations/fetchByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/api/provider-solicitations/provider/${userId}`,
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const fetchSolicitationsByStatus = createAsyncThunk(
  "providerSolicitations/fetchByStatus",
  async (status, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/api/provider-solicitations/status/${status}`,
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const createSolicitation = createAsyncThunk(
  "providerSolicitations/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/provider-solicitations", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const updateSolicitation = createAsyncThunk(
  "providerSolicitations/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        `/api/provider-solicitations/${id}`,
        payload,
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deleteSolicitation = createAsyncThunk(
  "providerSolicitations/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/provider-solicitations/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const providerSolicitationSlice = createSlice({
  name: "providerSolicitations",
  initialState: {
    solicitations: [],
    selectedSolicitation: null,
    loading: false,
    error: null,
    status: "idle",
  },
  reducers: {
    clearSelectedSolicitation: (state) => {
      state.selectedSolicitation = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSolicitations.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchSolicitations.fulfilled, (state, action) => {
        state.loading = false;
        state.solicitations = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchSolicitations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      .addCase(fetchSolicitationById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchSolicitationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSolicitation = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchSolicitationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      .addCase(fetchSolicitationsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchSolicitationsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.solicitations = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchSolicitationsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      .addCase(fetchSolicitationsByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchSolicitationsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.solicitations = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchSolicitationsByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      .addCase(createSolicitation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(createSolicitation.fulfilled, (state, action) => {
        state.loading = false;
        state.solicitations.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(createSolicitation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      .addCase(updateSolicitation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(updateSolicitation.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        const index = state.solicitations.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) state.solicitations[index] = action.payload;
      })
      .addCase(updateSolicitation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      .addCase(deleteSolicitation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(deleteSolicitation.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.solicitations = state.solicitations.filter(
          (s) => s.id !== action.payload,
        );
      })
      .addCase(deleteSolicitation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      });
  },
});

export const { clearSelectedSolicitation, clearError } =
  providerSolicitationSlice.actions;
export default providerSolicitationSlice.reducer;
