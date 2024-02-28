import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: {
        username: null
    },
    error: null,
    loading: false
}

export const login = createAsyncThunk('auth/login', async(payload, { rejectWithValue }) => {
    try {
        const response = await axios.post('/login', payload);
        return response;
      } catch (error) {
        return error.message;
      }
})

export const register = createAsyncThunk('auth/register', async(payload, { rejectWithValue }) => {
    const {username, password} = payload;
    try {
        const response = await axios.post('/register', {username, password});
        return response;
      } catch (error) {
        return error.message;
      }
})

export const logout = createAsyncThunk('auth/logout', async(payload, { rejectWithValue }) => {
    try {
        const response = await axios.post('/logout');
        return response;
      } catch (error) {
        return error.message;
      }
})

export const profile = createAsyncThunk('auth/profile', async(payload, { rejectWithValue }) => {
    try {
        const response = await axios.get('/profile');
        return response;
      } catch (error) {
        return error.message;
      }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        getAuthUser: (state, payload) => {
            return state.user;
        }
    },
    extraReducers: (builder, state) => {
        builder
        .addCase(login.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.data;
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.errorMessage;
        })
        .addCase(register.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.data;
        })
        .addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.errorMessage;
        })
        .addCase(logout.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(logout.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.data;
        })
        .addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.errorMessage;
        })
        .addCase(profile.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(profile.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.data;
        })
        .addCase(profile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.errorMessage;
        })

    }
})

export const { getAuthUser } = authSlice.actions
export default authSlice.reducer