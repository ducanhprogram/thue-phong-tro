import { getProvinces } from "@/services/provinceService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    provinces: [],
    loading: false,
    error: null,
};

export const fetchProvinces = createAsyncThunk("province/getProvinces", async (_, { rejectWithValue }) => {
    try {
        const response = await getProvinces();
        return response;
    } catch (error) {
        console.log("Error in fetchProvinces thunk:", error);
        return rejectWithValue({
            message: error.message,
            statusCode: error.statusCode || 500,
        });
    }
});

const provinceSlice = createSlice({
    name: "province",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearProvinces: (state) => {
            state.provinces = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProvinces.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProvinces.fulfilled, (state, action) => {
                state.loading = false;
                state.provinces = action.payload.data || action.payload;
                state.error = null;
            })
            .addCase(fetchProvinces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearProvinces } = provinceSlice.actions;
export default provinceSlice.reducer;
