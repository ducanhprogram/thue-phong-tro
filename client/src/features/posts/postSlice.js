// postSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    apiUpdatePost,
    getNewPosts,
    getPostLimit,
    getPosts,
    getPostsLimitAdmin,
    apiDeletePost,
    getRelatedPosts,
    getPostById,
} from "@/services/postService";

const initialState = {
    posts: [],
    newPosts: [],
    postsOfCurrent: [],
    postDetail: null,
    relatedPosts: [],
    loading: false,
    error: null,
    paginatedPosts: [],
    pagination: {
        totalPages: 0,
        currentPage: 1,
        limit: 10,
        totalItems: 0,
    },
    adminPagination: {
        totalPages: 0,
        currentPage: 1,
        limit: 10,
        totalItems: 0,
    },

    postDetailLoading: false,
    relatedPostsLoading: false,
};

export const fetchPostById = createAsyncThunk("posts/getPostById", async (postId, { rejectWithValue }) => {
    try {
        const response = await getPostById(postId);
        return response;
    } catch (error) {
        console.log("Error in fetchPostById thunk:", error);
        return rejectWithValue({
            message: error.message,
            statusCode: error.statusCode || 500,
        });
    }
});

export const fetchRelatedPosts = createAsyncThunk(
    "posts/getRelatedPosts",
    async ({ postId, categoryCode, provinceCode, limit = 5 }, { rejectWithValue }) => {
        try {
            const response = await getRelatedPosts(postId, categoryCode, provinceCode, limit);
            return response;
        } catch (error) {
            console.log("Error in fetchRelatedPosts thunk:", error);
            return rejectWithValue({
                message: error.message,
                statusCode: error.statusCode || 500,
            });
        }
    },
);
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

export const fetchPostsLimitAdmin = createAsyncThunk(
    "posts/getPostsLimitAdmin",
    async ({ page = 1, limit = 10, query = {} } = {}, { rejectWithValue }) => {
        try {
            const response = await getPostsLimitAdmin(page, limit, query);
            console.log("response get limit admin", response);
            return response;
        } catch (error) {
            console.log("Error in fetchPostsLimitAdmin thunk:", error);
            return rejectWithValue({
                message: error.message,
                statusCode: error.statusCode || 500,
            });
        }
    },
);

export const updatePost = createAsyncThunk("posts/updatePost", async ({ postId, payload }, { rejectWithValue }) => {
    try {
        const response = await apiUpdatePost(postId, payload);
        return { postId, updatedPost: response.data };
    } catch (error) {
        console.log("Error in updatePost thunk:", error);
        return rejectWithValue({
            message: error.message,
            statusCode: error.statusCode || 500,
        });
    }
});

export const deletePost = createAsyncThunk("posts/deletePost", async (postId, { rejectWithValue }) => {
    try {
        const response = await apiDeletePost(postId);
        return { postId, ...response };
    } catch (error) {
        console.log("Error in deletePost thunk:", error);
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
        clearPostDetail: (state) => {
            state.postDetail = null;
            state.relatedPosts = [];
            state.postDetailLoading = false;
            state.relatedPostsLoading = false;
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
            })
            //fetch post limit admin
            .addCase(fetchPostsLimitAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPostsLimitAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.postsOfCurrent = action.payload.data.data || action.payload;
                state.adminPagination = {
                    totalPages: action.payload.data.pagination?.totalPages || 0,
                    currentPage: action.payload.data.pagination?.currentPage || 1,
                    limit: action.payload.data.pagination?.limit || 10,
                    totalItems: action.payload.data.pagination?.totalItems || 0,
                };
                state.error = null;
            })
            .addCase(fetchPostsLimitAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updatePost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.loading = false;
                // Cập nhật post trong postsOfCurrent
                const { postId, updatedPost } = action.payload;
                state.postsOfCurrent = state.postsOfCurrent.map((post) => (post.id === postId ? updatedPost : post));
                state.error = null;
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //delete post
            .addCase(deletePost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false;
                // Xóa bài viết khỏi postsOfCurrent
                const { postId } = action.payload;
                state.postsOfCurrent = state.postsOfCurrent.filter((post) => post.id !== postId);
                state.error = null;
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Thêm cases cho PostDetail
            .addCase(fetchPostById.pending, (state) => {
                state.postDetailLoading = true;
                state.error = null;
            })
            .addCase(fetchPostById.fulfilled, (state, action) => {
                state.postDetailLoading = false;
                state.postDetail = action.payload.data;
                state.error = null;
            })
            .addCase(fetchPostById.rejected, (state, action) => {
                state.postDetailLoading = false;
                state.error = action.payload;
                state.postDetail = null;
            })
            .addCase(fetchRelatedPosts.pending, (state) => {
                state.relatedPostsLoading = true;
                state.error = null;
            })
            .addCase(fetchRelatedPosts.fulfilled, (state, action) => {
                state.relatedPostsLoading = false;
                state.relatedPosts = action.payload.data || [];
                state.error = null;
            })
            .addCase(fetchRelatedPosts.rejected, (state, action) => {
                state.relatedPostsLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearPosts, clearPostDetail } = postSlice.actions;
export default postSlice.reducer;
