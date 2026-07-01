import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosConfig";

export const fetchBoxSolicitations = createAsyncThunk(
  "boxSolicitations/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/box-solicitations");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const fetchBoxSolicitationsByProvider = createAsyncThunk(
  "boxSolicitations/fetchByProvider",
  async (providerId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/api/box-solicitations/provider/${providerId}`,
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const createBoxSolicitation = createAsyncThunk(
  "boxSolicitations/create",
  async ({ fields, images }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        if (value != null && value !== "") formData.append(key, value);
      });
      images.forEach((img) => formData.append("images", img));
      const { data } = await api.post("/api/box-solicitations", formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const updateBoxSolicitation = createAsyncThunk(
  "boxSolicitations/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/box-solicitations/${id}`, payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deleteBoxSolicitation = createAsyncThunk(
  "boxSolicitations/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/box-solicitations/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const boxSolicitationSlice = createSlice({
  name: "boxSolicitations",
  initialState: {
    solicitations: [],
    loading: false,
    error: null,
    status: "idle",
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoxSolicitations.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchBoxSolicitations.fulfilled, (state, action) => {
        state.loading = false;
        state.solicitations = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchBoxSolicitations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      .addCase(fetchBoxSolicitationsByProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchBoxSolicitationsByProvider.fulfilled, (state, action) => {
        state.loading = false;
        state.solicitations = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchBoxSolicitationsByProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      .addCase(createBoxSolicitation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(createBoxSolicitation.fulfilled, (state, action) => {
        state.loading = false;
        state.solicitations.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(createBoxSolicitation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      .addCase(updateBoxSolicitation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(updateBoxSolicitation.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        const index = state.solicitations.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) state.solicitations[index] = action.payload;
      })
      .addCase(updateBoxSolicitation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      })

      .addCase(deleteBoxSolicitation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(deleteBoxSolicitation.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.solicitations = state.solicitations.filter(
          (s) => s.id !== action.payload,
        );
      })
      .addCase(deleteBoxSolicitation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "failed";
      });
  },
});

export const { clearError } = boxSolicitationSlice.actions;
export default boxSolicitationSlice.reducer;
