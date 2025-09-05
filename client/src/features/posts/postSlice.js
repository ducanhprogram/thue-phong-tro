// src/features/posts/postSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPostLimit, getPosts } from "@/services/postService";

const initialState = {
    posts: [],
    loading: false,
    error: null,
    paginatedPosts: [],
    pagination: {
        totalPages: 0,
        currentPage: 1,
        limit: 10,
        totalItems: 0,
    },
};

// Async thunk để lấy danh sách posts
export const fetchPosts = createAsyncThunk("posts/getPosts", async (_, { rejectWithValue }) => {
    try {
        const response = await getPosts();
        return response;
    } catch (error) {
        console.log("Error in fetchPosts thunk:", error);
        // Chỉ trả về message và các thuộc tính có thể serialize
        return rejectWithValue({
            message: error.message,
            statusCode: error.statusCode || 500,
        });
    }
});

export const fetchPostsLimit = createAsyncThunk("posts/getPostsLimit", async ({ page, limit }, { rejectWithValue }) => {
    try {
        const response = await getPostLimit(page, limit);
        return response;
    } catch (error) {
        console.log("Error in fetchPostsLimit thunk:", error);
        return rejectWithValue({
            message: error.message,
            statusCode: error.statusCode || 500,
        });
    }
});

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearPosts: (state) => {
            state.posts = [];
            state.paginatedPosts = [];
            state.pagination = initialState.pagination;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get posts cases
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload.data || action.payload;
                state.error = null;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPostsLimit.pending, (state) => {
                (state.loading = true), (state.error = null);
            })
            .addCase(fetchPostsLimit.fulfilled, (state, action) => {
                state.loading = false;
                state.paginatedPosts = action.payload.data.data || [];
                state.pagination = action.payload.data.pagination || initialState.pagination;
                state.error = null;
            })
            .addCase(fetchPostsLimit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearPosts } = postSlice.actions;
export default postSlice.reducer;
