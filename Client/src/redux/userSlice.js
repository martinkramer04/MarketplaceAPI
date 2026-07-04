import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosConfig";

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data: authData } = await api.post("/auth/authenticate", { email, password });
      const token = authData.accessToken || authData.access_token;
      if (!token) throw new Error("Token no recibido");
      localStorage.setItem("access_token", token);
      const { data: userData } = await api.get("/auth/me");
      return { token, user: userData };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Email o contraseña incorrectos. Intentá de nuevo.");
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async ({ firstname, lastname, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/register", { firstname, lastname, email, password, role: "USER" });
      const token = data.access_token || data.accessToken;
      if (!token) throw new Error("Token no recibido");
      localStorage.setItem("access_token", token);
      return { token };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "No se pudo completar el registro. El email puede estar en uso.");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/me");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Sesión inválida.");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    token: localStorage.getItem("access_token"),
    isAuthenticated: !!localStorage.getItem("access_token"),
    loading: false,
    error: null,
    status: "idle",
  },
  reducers: {
    logoutUser(state) {
      state.data = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.status = "idle";
      localStorage.removeItem("access_token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.data = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = "failed";
        state.data = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("access_token");
      });
  },
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
