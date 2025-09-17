// src/features/province/provinceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    getProvinces,
    getDistricts,
    getWards,
    getProvinceById,
    getDistrictById,
    searchProvinces,
    searchDistricts,
    searchWards,
} from "@/services/provinceService";

const initialState = {
    provinces: [],
    districts: [],
    wards: [],
    selectedProvince: null,
    selectedDistrict: null,
    selectedWard: null,
    searchResults: {
        provinces: [],
        districts: [],
        wards: [],
    },
    loading: {
        provinces: false,
        districts: false,
        wards: false,
        search: false,
    },
    error: null,
};

// Async thunk để lấy danh sách tỉnh thành
export const fetchProvinces = createAsyncThunk("province/fetchProvinces", async (_, { rejectWithValue }) => {
    try {
        const response = await getProvinces();
        return response.results || [];
    } catch (error) {
        console.error("Error in fetchProvinces thunk:", error);
        return rejectWithValue({
            message: error.message,
            statusCode: error.statusCode || 500,
        });
    }
});

// Async thunk để lấy danh sách quận/huyện
export const fetchDistricts = createAsyncThunk("province/fetchDistricts", async (provinceId, { rejectWithValue }) => {
    try {
        const response = await getDistricts(provinceId);
        return response.results || [];
    } catch (error) {
        console.error("Error in fetchDistricts thunk:", error);
        return rejectWithValue({
            message: error.message,
            statusCode: error.statusCode || 500,
        });
    }
});

// Async thunk để lấy danh sách xã/phường
export const fetchWards = createAsyncThunk("province/fetchWards", async (districtId, { rejectWithValue }) => {
    try {
        const response = await getWards(districtId);
        return response.results || [];
    } catch (error) {
        console.error("Error in fetchWards thunk:", error);
        return rejectWithValue({
            message: error.message,
            statusCode: error.statusCode || 500,
        });
    }
});

// Async thunk để lấy thông tin tỉnh theo ID
export const fetchProvinceById = createAsyncThunk(
    "province/fetchProvinceById",
    async (provinceId, { rejectWithValue }) => {
        try {
            const response = await getProvinceById(provinceId);
            return response.results?.[0] || null;
        } catch (error) {
            console.error("Error in fetchProvinceById thunk:", error);
            return rejectWithValue({
                message: error.message,
                statusCode: error.statusCode || 500,
            });
        }
    },
);

// Async thunk để lấy thông tin quận/huyện theo ID
export const fetchDistrictById = createAsyncThunk(
    "province/fetchDistrictById",
    async ({ provinceId, districtId }, { rejectWithValue }) => {
        try {
            const response = await getDistrictById(provinceId, districtId);
            return response.results?.[0] || null;
        } catch (error) {
            console.error("Error in fetchDistrictById thunk:", error);
            return rejectWithValue({
                message: error.message,
                statusCode: error.statusCode || 500,
            });
        }
    },
);

// Async thunk để tìm kiếm tỉnh thành
export const searchProvincesAsync = createAsyncThunk(
    "province/searchProvinces",
    async (searchTerm, { rejectWithValue }) => {
        try {
            const response = await searchProvinces(searchTerm);
            return response.results || [];
        } catch (error) {
            console.error("Error in searchProvinces thunk:", error);
            return rejectWithValue({
                message: error.message,
                statusCode: error.statusCode || 500,
            });
        }
    },
);

// Async thunk để tìm kiếm quận/huyện
export const searchDistrictsAsync = createAsyncThunk(
    "province/searchDistricts",
    async ({ provinceId, searchTerm }, { rejectWithValue }) => {
        try {
            const response = await searchDistricts(provinceId, searchTerm);
            return response.results || [];
        } catch (error) {
            console.error("Error in searchDistricts thunk:", error);
            return rejectWithValue({
                message: error.message,
                statusCode: error.statusCode || 500,
            });
        }
    },
);

// Async thunk để tìm kiếm xã/phường
export const searchWardsAsync = createAsyncThunk(
    "province/searchWards",
    async ({ districtId, searchTerm }, { rejectWithValue }) => {
        try {
            const response = await searchWards(districtId, searchTerm);
            return response.results || [];
        } catch (error) {
            console.error("Error in searchWards thunk:", error);
            return rejectWithValue({
                message: error.message,
                statusCode: error.statusCode || 500,
            });
        }
    },
);

const provinceSlice = createSlice({
    name: "province",
    initialState,
    reducers: {
        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Clear all data
        clearAllProvinceData: (state) => {
            Object.assign(state, initialState);
        },

        // Clear districts when province changes
        clearDistricts: (state) => {
            state.districts = [];
            state.selectedDistrict = null;
            state.wards = [];
            state.selectedWard = null;
        },

        // Clear wards when district changes
        clearWards: (state) => {
            state.wards = [];
            state.selectedWard = null;
        },

        // Set selected province
        setSelectedProvince: (state, action) => {
            state.selectedProvince = action.payload;
            // Clear districts and wards when province changes
            state.districts = [];
            state.selectedDistrict = null;
            state.wards = [];
            state.selectedWard = null;
        },

        // Set selected district
        setSelectedDistrict: (state, action) => {
            state.selectedDistrict = action.payload;
            // Clear wards when district changes
            state.wards = [];
            state.selectedWard = null;
        },

        // Set selected ward
        setSelectedWard: (state, action) => {
            state.selectedWard = action.payload;
        },

        // Clear search results
        clearSearchResults: (state) => {
            state.searchResults = {
                provinces: [],
                districts: [],
                wards: [],
            };
        },

        // Reset to specific location
        resetToProvince: (state) => {
            state.selectedDistrict = null;
            state.selectedWard = null;
            state.districts = [];
            state.wards = [];
        },

        resetToDistrict: (state) => {
            state.selectedWard = null;
            state.wards = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch provinces cases
            .addCase(fetchProvinces.pending, (state) => {
                state.loading.provinces = true;
                state.error = null;
            })
            .addCase(fetchProvinces.fulfilled, (state, action) => {
                state.loading.provinces = false;
                state.provinces = action.payload;
                state.error = null;
            })
            .addCase(fetchProvinces.rejected, (state, action) => {
                state.loading.provinces = false;
                state.error = action.payload;
            })

            // Fetch districts cases
            .addCase(fetchDistricts.pending, (state) => {
                state.loading.districts = true;
                state.error = null;
            })
            .addCase(fetchDistricts.fulfilled, (state, action) => {
                state.loading.districts = false;
                state.districts = action.payload;
                state.error = null;
            })
            .addCase(fetchDistricts.rejected, (state, action) => {
                state.loading.districts = false;
                state.error = action.payload;
            })

            // Fetch wards cases
            .addCase(fetchWards.pending, (state) => {
                state.loading.wards = true;
                state.error = null;
            })
            .addCase(fetchWards.fulfilled, (state, action) => {
                state.loading.wards = false;
                state.wards = action.payload;
                state.error = null;
            })
            .addCase(fetchWards.rejected, (state, action) => {
                state.loading.wards = false;
                state.error = action.payload;
            })

            // Fetch province by ID cases
            .addCase(fetchProvinceById.pending, (state) => {
                state.loading.provinces = true;
                state.error = null;
            })
            .addCase(fetchProvinceById.fulfilled, (state, action) => {
                state.loading.provinces = false;
                state.selectedProvince = action.payload;
                state.error = null;
            })
            .addCase(fetchProvinceById.rejected, (state, action) => {
                state.loading.provinces = false;
                state.error = action.payload;
            })

            // Fetch district by ID cases
            .addCase(fetchDistrictById.pending, (state) => {
                state.loading.districts = true;
                state.error = null;
            })
            .addCase(fetchDistrictById.fulfilled, (state, action) => {
                state.loading.districts = false;
                state.selectedDistrict = action.payload;
                state.error = null;
            })
            .addCase(fetchDistrictById.rejected, (state, action) => {
                state.loading.districts = false;
                state.error = action.payload;
            })

            // Search provinces cases
            .addCase(searchProvincesAsync.pending, (state) => {
                state.loading.search = true;
                state.error = null;
            })
            .addCase(searchProvincesAsync.fulfilled, (state, action) => {
                state.loading.search = false;
                state.searchResults.provinces = action.payload;
                state.error = null;
            })
            .addCase(searchProvincesAsync.rejected, (state, action) => {
                state.loading.search = false;
                state.error = action.payload;
            })

            // Search districts cases
            .addCase(searchDistrictsAsync.pending, (state) => {
                state.loading.search = true;
                state.error = null;
            })
            .addCase(searchDistrictsAsync.fulfilled, (state, action) => {
                state.loading.search = false;
                state.searchResults.districts = action.payload;
                state.error = null;
            })
            .addCase(searchDistrictsAsync.rejected, (state, action) => {
                state.loading.search = false;
                state.error = action.payload;
            })

            // Search wards cases
            .addCase(searchWardsAsync.pending, (state) => {
                state.loading.search = true;
                state.error = null;
            })
            .addCase(searchWardsAsync.fulfilled, (state, action) => {
                state.loading.search = false;
                state.searchResults.wards = action.payload;
                state.error = null;
            })
            .addCase(searchWardsAsync.rejected, (state, action) => {
                state.loading.search = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearError,
    clearAllProvinceData,
    clearDistricts,
    clearWards,
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedWard,
    clearSearchResults,
    resetToProvince,
    resetToDistrict,
} = provinceSlice.actions;

export default provinceSlice.reducer;
