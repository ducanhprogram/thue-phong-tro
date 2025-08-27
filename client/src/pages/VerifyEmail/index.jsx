import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyUserEmail, clearError } from "@/features/auth/authSlice";

const VerifyEmail = () => {
    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState("");
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading } = useSelector((state) => state.auth);

    useEffect(() => {
        const handleVerification = async () => {
            if (!token) {
                setStatus("error");
                setMessage("Token xác thực không hợp lệ.");
                return;
            }

            try {
                // Sử dụng Redux thunk thay vì gọi trực tiếp service
                await dispatch(verifyUserEmail(token)).unwrap();

                setStatus("success");
                setMessage("Email đã được xác thực thành công!");

                setTimeout(() => {
                    navigate("/login", {
                        state: {
                            verificationSuccess: true,
                            message: "Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.",
                        },
                    });
                }, 3000);
            } catch (error) {
                setStatus("error");
                setMessage(error.message || "Xác thực email thất bại. Token có thể đã hết hạn.");
            }
        };

        handleVerification();

        // Cleanup error khi component unmount
        return () => {
            dispatch(clearError());
        };
    }, [token, navigate, dispatch]);

    const goToLogin = () => {
        navigate("/login");
    };

    const goToRegister = () => {
        navigate("/register");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Xác thực Email</h2>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="text-center">
                        {(status === "verifying" || loading) && (
                            <div>
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                                <p className="text-gray-600">Đang xác thực email của bạn...</p>
                            </div>
                        )}

                        {status === "success" && !loading && (
                            <div>
                                <div className="rounded-full bg-green-100 p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                                    <svg
                                        className="w-8 h-8 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        ></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Xác thực thành công!</h3>
                                <p className="text-green-600 mb-4">{message}</p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Bạn sẽ được chuyển hướng đến trang đăng nhập trong 3 giây...
                                </p>
                                <button
                                    onClick={goToLogin}
                                    className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition duration-200"
                                >
                                    Đăng nhập ngay
                                </button>
                            </div>
                        )}

                        {status === "error" && !loading && (
                            <div>
                                <div className="rounded-full bg-red-100 p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                                    <svg
                                        className="w-8 h-8 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        ></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Xác thực thất bại!</h3>
                                <p className="text-red-600 mb-4">{message}</p>

                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600 mb-4">
                                        Token có thể đã hết hạn hoặc không hợp lệ. Bạn có thể:
                                    </p>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={goToLogin}
                                            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition duration-200"
                                        >
                                            Đăng nhập và gửi lại email xác thực
                                        </button>

                                        <button
                                            onClick={goToRegister}
                                            className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition duration-200"
                                        >
                                            Đăng ký lại
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-center">
                    <Link to="/" className="text-orange-500 hover:text-orange-600 font-medium">
                        ← Quay về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
