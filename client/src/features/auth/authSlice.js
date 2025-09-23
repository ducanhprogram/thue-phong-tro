// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, resetPassword, verifyEmail, resendVerifyEmail, getMe } from "@/services/authService";

const initialState = {
    loginUser: null,
    profileUser: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoggedIn: false,
    loading: false,
    error: null,
};

// Async thunk để đăng ký
export const registerUser = createAsyncThunk(
    "auth/register",
    async ({ name, email, password, phone }, { rejectWithValue }) => {
        try {
            const response = await register(name, email, password, phone);
            return response;
        } catch (error) {
            // Truyền đầy đủ thông tin error bao gồm cả errors array
            return rejectWithValue({
                message: error.message,
                statusCode: error.statusCode || 500,
                errors: error.errors || error.response?.data?.errors || [], // Thêm errors
            });
        }
    },
);

// Async thunk để đăng nhập
export const loginUser = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await login(email, password);
        return response.data;
    } catch (error) {
        console.log("Error in login thunk:", error);
        // Truyền đầy đủ thông tin error bao gồm cả errors array
        return rejectWithValue({
            message: error.message,
            statusCode: error.statusCode || 500,
            errors: error.errors || error.response?.data?.errors, // Thêm errors
        });
    }
});

// Async thunk để xác thực email
export const verifyUserEmail = createAsyncThunk("auth/verifyEmail", async (token, { rejectWithValue }) => {
    try {
        const response = await verifyEmail(token);
        return response;
    } catch (error) {
        console.log("Error in verify email thunk:", error);
        return rejectWithValue({
            message: error.message,
            statusCode: error.statusCode || 500,
            errors: error.errors || error.response?.data?.errors, // Thêm errors
        });
    }
});

// Async thunk để gửi lại email xác thực
export const resendVerifyUserEmail = createAsyncThunk("auth/resendVerifyEmail", async (email, { rejectWithValue }) => {
    try {
        const response = await resendVerifyEmail(email);
        return response;
    } catch (error) {
        console.log("Error in resend verify email thunk:", error);
        return rejectWithValue({
            message: error.message,
            statusCode: error.statusCode || 500,
            errors: error.errors || error.response?.data?.errors, // Thêm errors
        });
    }
});

// Async thunk để đặt lại mật khẩu
export const resetUserPassword = createAsyncThunk(
    "auth/resetPassword",
    async ({ token, password }, { rejectWithValue }) => {
        try {
            const response = await resetPassword(token, password);
            return response;
        } catch (error) {
            console.log("Error in reset password thunk:", error);
            return rejectWithValue({
                message: error.message,
                statusCode: error.statusCode || 500,
                errors: error.errors || error.response?.data?.errors, // Thêm errors
            });
        }
    },
);

export const fetchUserProfile = createAsyncThunk("auth/fetchUserProfile", async (_, { rejectWithValue }) => {
    try {
        const response = await getMe();
        return response.data;
    } catch (error) {
        return rejectWithValue({
            message: error.message,
            statusCode: error.statusCode || 500,
        });
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            Object.assign(state, initialState);
            state.loginUser = null;
            state.profileUser = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.isLoggedIn = false;
            state.error = null;
        },
        setCredentials: (state, action) => {
            const { accessToken, refreshToken, profileUser } = action.payload;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.profileUser = profileUser;
            state.isAuthenticated = true;
            state.isLoggedIn = true;
        },
        clearAllData: (state) => {
            // Reset về initial state
            Object.assign(state, initialState);
            // Xóa localStorage
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("persist:auth");
        },
    },
    extraReducers: (builder) => {
        builder
            // Register cases
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Bây giờ bao gồm cả errors array
            })

            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.loginUser = action.payload.user;
                state.isAuthenticated = true;
                state.isLoggedIn = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Bây giờ bao gồm cả errors array
            })
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profileUser = action.payload.user;
                state.loginUser = action.payload.user;
                state.isAuthenticated = true;
                state.isLoggedIn = true;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Bây giờ bao gồm cả errors array
            })

            // Verify email cases
            .addCase(verifyUserEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyUserEmail.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(verifyUserEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Resend verify email cases
            .addCase(resendVerifyUserEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resendVerifyUserEmail.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(resendVerifyUserEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Reset password cases
            .addCase(resetUserPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetUserPassword.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
                state.isLoggedIn = false;
            })
            .addCase(resetUserPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, logout, setCredentials, clearAllData } = authSlice.actions;
export default authSlice.reducer;
