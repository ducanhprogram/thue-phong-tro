// src/features/area/areaSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAreas } from "@/services/areaService";

const initialState = {
    message: "",
    areas: [],
    loading: false,
    error: null,
};

// Async thunk để lấy danh sách areas
export const fetchAreas = createAsyncThunk("area/getAreas", async (_, { rejectWithValue }) => {
    try {
        const response = await getAreas();
        return response;
    } catch (error) {
        console.log("Error in fetchAreas thunk:", error);
        // Trả về thông tin error có thể serialize
        return rejectWithValue({
            message: error.message,
            statusCode: error.statusCode || 500,
        });
    }
});

const areaSlice = createSlice({
    name: "area",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = "";
        },
        clearAreas: (state) => {
            state.areas = [];
            state.error = null;
        },
        setMessage: (state, action) => {
            state.message = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get areas cases
            .addCase(fetchAreas.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAreas.fulfilled, (state, action) => {
                state.loading = false;
                // Sắp xếp areas theo order nếu có
                const areasData = action.payload.data || action.payload;
                state.areas = Array.isArray(areasData)
                    ? areasData.sort((a, b) => (a.order || 0) - (b.order || 0))
                    : areasData;
                state.message = action.payload.message || "Lấy danh sách khu vực thành công";
                state.error = null;
            })
            .addCase(fetchAreas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message = action.payload?.message || "Lấy danh sách khu vực thất bại";
                state.areas = [];
            });
    },
});

export const { clearError, clearMessage, clearAreas, setMessage } = areaSlice.actions;
export default areaSlice.reducer;
