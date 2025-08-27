const config = {
    routes: {
        home: "/",
        register: "/register",
        login: "/login",
        verifyEmail: "/verify-email/:token",
        resetPassword: "/reset-password/:token",
        forgotPassword: "/forgot-password",
        changePassword: "/change-password",
    },
};

export default config;
