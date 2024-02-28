import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: {
        username: null
    },
    error: null,
    loading: false
}

const createAuthAsyncThunk = (name, url, payloadHandler) => {
  return createAsyncThunk(`auth/${name}`, async(payload, { rejectWithValue }) => {
    try {
        const response = await axios[payloadHandler](url, payload);
        return response;
      } catch (error) {
        return rejectWithValue(error.message);
      }
  });
}

export const login = createAuthAsyncThunk('login', '/login', 'post');
export const register = createAuthAsyncThunk('register', '/register', 'post');
export const logout = createAuthAsyncThunk('logout', '/logout', 'post');
export const profile = createAuthAsyncThunk('profile', '/profile', 'get');

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        getAuthUser: (state, payload) => {
            return state.user;
        }
    },
    extraReducers: (builder, state) => {
        [login, register, logout, profile].forEach((asyncAction) => {
          builder
            .addCase(asyncAction.pending, (state, action) => {
              state.loading = true;
            })
            .addCase(asyncAction.fulfilled, (state, action) => {
              state.loading = false;
              state.user = action.payload.data;
            })
            .addCase(asyncAction.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload.errorMessage;
            });
        });
    }
});

export const { getAuthUser } = authSlice.actions
export default authSlice.reducer;
