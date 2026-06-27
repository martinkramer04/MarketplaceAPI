import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

export const fetchCurrentUser = createAsyncThunk(
    'user/fetchCurrent',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/auth/me');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.put('/auth/me', payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const UserSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearUser: (state) => { state.currentUser = null; },
        clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => { state.loading = false; state.currentUser = action.payload; })
            .addCase(fetchCurrentUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(updateProfile.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateProfile.fulfilled, (state, action) => { state.loading = false; state.currentUser = action.payload; })
            .addCase(updateProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
    }
});

export const { clearUser, clearError } = UserSlice.actions;
export default UserSlice.reducer;