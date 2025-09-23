// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "@/features/auth/authSlice";
import userReducer from "@/features/users/userSlice";
import postReducer from "@/features/posts/postSlice";
import appReducer from "@/features/app/appSlice";
import areaReducer from "@/features/area/areaSlice";
import provinceReducer from "@/features/province/provinceSlice";

const persistConfig = {
    key: "auth", // Đổi key để tránh conflict
    storage,
    whitelist: [
        "loginUser",
        "provinces",
        "profileUser",
        "accessToken",
        "refreshToken",
        "isAuthenticated",
        "isLoggedIn",
    ], // Chỉ persist những field cần thiết
};

// Persist config cho user (tùy chọn, có thể không cần persist profile)
const userPersistConfig = {
    key: "user",
    storage,
    whitelist: ["profile"], // Chỉ persist profile
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        user: persistedUserReducer,
        posts: postReducer,
        app: appReducer,
        areas: areaReducer,
        provinces: provinceReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
