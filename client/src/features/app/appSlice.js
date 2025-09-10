// src/features/app/appSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCategories } from "@/services/categoryService";
import { getPrices } from "@/services/appService";

const initialState = {
    message: "",
    categories: [],
    prices: [],
    loading: false,
    error: null,
};

// Async thunk để lấy danh sách categories
export const fetchCategories = createAsyncThunk("app/getCategories", async (_, { rejectWithValue }) => {
    try {
        const response = await getCategories();
        return response;
    } catch (error) {
        console.log("Error in fetchCategories thunk:", error);
        // Trả về thông tin error có thể serialize
        return rejectWithValue({
            message: error.message,
            statusCode: error.statusCode || 500,
        });
    }
});

export const fetchPrices = createAsyncThunk("api/getPrices", async (_, { rejectWithValue }) => {
    try {
        const response = await getPrices();
        return response;
    } catch (error) {
        console.log("Error in fetchPrices thunk:", error);
        return rejectWithValue({
            message: error.message,
            statusCode: error.statusCode || 500,
        });
    }
});

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = "";
        },
        clearCategories: (state) => {
            state.categories = [];
            state.error = null;
        },
        setMessage: (state, action) => {
            state.message = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get categories cases
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                // Sắp xếp categories theo order nếu có
                const categoriesData = action.payload.data || action.payload;
                state.categories = Array.isArray(categoriesData)
                    ? categoriesData.sort((a, b) => (a.order || 0) - (b.order || 0))
                    : categoriesData;
                state.message = action.payload.message || "Lấy danh sách danh mục thành công";
                state.error = null;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message = action.payload?.message || "Lấy danh sách danh mục thất bại";
                state.categories = [];
            })
            // Get prices cases
            .addCase(fetchPrices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPrices.fulfilled, (state, action) => {
                state.loading = false;
                // Sắp xếp prices theo order tăng dần
                const pricesData = action.payload.data || action.payload;
                state.prices = Array.isArray(pricesData)
                    ? pricesData.sort((a, b) => (a.order || 0) - (b.order || 0))
                    : pricesData;
                state.message = action.payload.message || "Lấy danh sách khoảng giá thành công";
                state.error = null;
            })
            .addCase(fetchPrices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message = action.payload?.message || "Lấy danh sách khoảng giá thất bại";
                state.prices = [];
            });
    },
});

export const { clearError, clearMessage, clearCategories, setMessage } = appSlice.actions;
export default appSlice.reducer;
