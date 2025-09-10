const config = {
    routes: {
        home: "/",
        register: "/register",
        login: "/login",
        verifyEmail: "/verify-email/:token",
        resetPassword: "/reset-password/:token",
        forgotPassword: "/forgot-password",
        changePassword: "/change-password",
        chothuecanho: "/cho-thue-can-ho",
        chothuematbang: "/cho-thue-mat-bang",
        chothuephongtro: "/cho-thue-phong-tro",
        nhachothue: "/nha-cho-thue",
        postDetailTitlePostID: "/chi-tiet/:title/:postId",
        homePage: "/",
        notFound: "*",
    },
};

export default config;
