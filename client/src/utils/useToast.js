// src/utils/useToast.js
import { toast } from "react-hot-toast";

const useToast = () => {
    const toastOptions = {
        position: "top-center",
        reverseOrder: false,
        gutter: 8,
        containerClassName: "",
        containerStyle: {},
        toastOptions: {
            className: "",
            duration: 3000,
            style: {
                background: "#363636",
                color: "#fff",
                padding: "12px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                maxWidth: "400px",
            },
            success: {
                duration: 4000,
                theme: {
                    primary: "green",
                    secondary: "black",
                },
                style: {
                    background: "#10b981",
                },
                iconTheme: {
                    primary: "#ffffff",
                    secondary: "#10b981",
                },
            },
            error: {
                duration: 4000,
                style: {
                    background: "#ef4444",
                },
                iconTheme: {
                    primary: "#ffffff",
                    secondary: "#ef4444",
                },
            },
            loading: {
                style: {
                    background: "#3b82f6",
                },
            },
        },
    };

    const showSuccess = (message, options = {}) => {
        toast.success(message, { ...toastOptions.toastOptions.success, ...options });
    };

    const showError = (message, options = {}) => {
        toast.error(message, { ...toastOptions.toastOptions.error, ...options });
    };

    const showLoading = (message, options = {}) => {
        return toast.loading(message, { ...toastOptions.toastOptions.loading, ...options });
    };

    const dismiss = (toastId) => {
        toast.dismiss(toastId);
    };

    return { showSuccess, showError, showLoading, dismiss, toastOptions };
};

export default useToast;
