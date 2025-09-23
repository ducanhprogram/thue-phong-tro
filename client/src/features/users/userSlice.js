// src/features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProfile, updateProfile, changeAvatar } from "@/services/userService";
import { logout, clearAllData, loginUser } from "@/features/auth/authSlice";

const initialState = {
    profile: null,
    loading: false,
    error: null,
    updateLoading: false,
    avatarLoading: false,
};

// Async thunk để lấy thông tin profile
export const fetchUserProfile = createAsyncThunk("user/fetchProfile", async (_, { rejectWithValue }) => {
    try {
        const response = await getProfile();
        return response.data;
    } catch (error) {
        console.log("Error in fetchUserProfile thunk:", error);
        return rejectWithValue({
            message: error.message,
            statusCode: error.statusCode || 500,
            errors: error.errors || error.response?.data?.errors || [],
        });
    }
});

// Async thunk để cập nhật profile
export const updateUserProfile = createAsyncThunk("user/updateProfile", async (profileData, { rejectWithValue }) => {
    try {
        const response = await updateProfile(profileData);
        return response.data;
    } catch (error) {
        console.log("Error in updateUserProfile thunk:", error);
        return rejectWithValue({
            message: error.message,
            statusCode: error.statusCode || 500,
            errors: error.errors || error.response?.data?.errors || [],
        });
    }
});

// Async thunk để thay đổi avatar
export const updateUserAvatar = createAsyncThunk("user/updateAvatar", async (avatar, { rejectWithValue }) => {
    try {
        const response = await changeAvatar(avatar);
        return response.data;
    } catch (error) {
        console.log("Error in updateUserAvatar thunk:", error);
        return rejectWithValue({
            message: error.message,
            statusCode: error.statusCode || 500,
            errors: error.errors || error.response?.data?.errors || [],
        });
    }
});

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearProfile: (state) => {
            state.profile = null;
            state.error = null;
        },
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch profile cases
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload.user;
                state.error = null;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update profile cases
            .addCase(updateUserProfile.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.profile = action.payload.user;
                state.error = null;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            })

            // Update avatar cases
            .addCase(updateUserAvatar.pending, (state) => {
                state.avatarLoading = true;
                state.error = null;
            })
            .addCase(updateUserAvatar.fulfilled, (state, action) => {
                state.avatarLoading = false;
                state.profile = action.payload.user;
                state.error = null;
            })
            .addCase(updateUserAvatar.rejected, (state, action) => {
                state.avatarLoading = false;
                state.error = action.payload;
            })
            .addCase(logout, (state) => {
                // Reset user state khi logout từ auth
                Object.assign(state, initialState);
            })
            .addCase(clearAllData, (state) => {
                // Reset user state khi clearAllData từ auth
                Object.assign(state, initialState);
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                // Đồng bộ profile khi login thành công từ auth
                state.profile = action.payload.user;
                state.error = null;
            });
    },
});

export const { clearError, clearProfile, setProfile } = userSlice.actions;
export default userSlice.reducer;
