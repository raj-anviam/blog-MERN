import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    posts: [{
        '_id': '123456',
        'title': 'post title',
        'summary': 'post summary',
        'content': 'post content',
        'cover': 'https://flowbite.com/docs/images/examples/image-3@2x.jpg',
        'author': 'post author id',
        'createdAt': null,
        'updatedAt': null
    }],
    currentPost: null,
    error: null,
    loading: false,
}

export const fetchPosts = createAsyncThunk('list/post', async() => {
    try {
      const response = await axios.get('/post');
      return response;
    } catch (error) {
      return error.message;
    }
});

export const createPost = createAsyncThunk('create/post', async(payload, { rejectWithValue }) => {
  try {
    const response = await axios.post('/post', payload);
    return response;
  } catch (error) {
    if (error.response && error?.response?.status === 400) {
      return rejectWithValue({ errorMessage: error?.response?.data?.error, errorCode: 400 });
    }
    throw error;
  }
});

export const editPost = createAsyncThunk('edit/post', async(payload, { rejectWithValue }) => {
  try {
    const response = await axios.put('/post', payload);
    return response;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return rejectWithValue({ errorMessage: error?.response?.data?.error, errorCode: 400 });
    }
    throw error;
  }
});

export const deletePost = createAsyncThunk('delete/post', async(payload, { rejectWithValue }) => {
  try {
    const response = await axios.delete('/post/' + payload);
    return response;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return rejectWithValue({ errorMessage: error?.response?.data?.error, errorCode: 400 });
    }
    throw error;
  }
});

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
      getCurrentPost: (state, payload) => {
        state.currentPost = state.posts.filter(post => post._id == payload.payload)[0]
      },
    },
    extraReducers: (builder) => {
      builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.errorMessage : 'Error occurred';
      })
      .addCase(createPost.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.push(action.payload.data);
        state.loading = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.errorMessage : 'Error occurred';
      })
      .addCase(editPost.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(editPost.fulfilled, (state, action) => {
        state.posts.push(action.payload.data);
        state.loading = false;
      })
      .addCase(editPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.errorMessage : 'Error occurred';
      })
      .addCase(deletePost.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post._id !== action.payload.data.id)
        state.loading = false;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.errorMessage : 'Error occurred';
      })
      .addDefaultCase((state, action) => {
        state.loading = false;
      })
    },
})
  
export const { getCurrentPost, getPostsFailure } = postSlice.actions
export default postSlice.reducer