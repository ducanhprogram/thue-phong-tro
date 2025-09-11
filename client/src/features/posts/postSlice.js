// postSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getNewPosts, getPostLimit, getPosts } from "@/services/postService";

const initialState = {
    posts: [],
    newPosts: [],
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

export const fetchPosts = createAsyncThunk("posts/getPosts", async (_, { rejectWithValue }) => {
    try {
        const response = await getPosts();
        return response;
    } catch (error) {
        console.log("Error in fetchPosts thunk:", error);
        return rejectWithValue({
            message: error.message,
            statusCode: error.statusCode || 500,
        });
    }
});

export const fetchPostsLimit = createAsyncThunk(
    "posts/getPostsLimit",
    async ({ page, limit, priceCode, areaCode, categoryCode, provinceCode }, { rejectWithValue }) => {
        try {
            const response = await getPostLimit(page, limit, priceCode, areaCode, categoryCode, provinceCode);
            return response;
        } catch (error) {
            console.log("Error in fetchPostsLimit thunk:", error);
            return rejectWithValue({
                message: error.message,
                statusCode: error.statusCode || 500,
            });
        }
    },
);

export const fetchNewPosts = createAsyncThunk("posts/getNewPosts", async (_, { rejectWithValue }) => {
    try {
        const response = await getNewPosts();
        return response;
    } catch (error) {
        console.log("Error in fetchNewPosts thunk:", error);
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
                state.loading = true;
                state.error = null;
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
            })
            .addCase(fetchNewPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNewPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.newPosts = action.payload.data || action.payload;
                state.error = null;
            })
            .addCase(fetchNewPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearPosts } = postSlice.actions;
export default postSlice.reducer;
