import InputForm from "@/components/InputForm";
import ForgotPasswordModal from "@/pages/ForgotPassword";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "@/features/auth/authSlice";
import { resendVerifyEmail } from "@/services/authService";
import useToast from "@/utils/useToast";
import { Toaster } from "react-hot-toast";
import clsx from "clsx";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showResendVerification, setShowResendVerification] = useState(false);
    const [unverifiedEmail, setUnverifiedEmail] = useState("");
    const [resendLoading, setResendLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const { showError, showSuccess, showLoading, dismiss, toastOptions } = useToast();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleResendVerification = async () => {
        if (!unverifiedEmail.trim()) {
            showError("Vui lòng nhập email để gửi lại xác thực!");
            return;
        }

        setResendLoading(true);
        const loadingToast = showLoading("Đang gửi email xác thực...");

        try {
            await resendVerifyEmail(unverifiedEmail);
            showSuccess("Email xác thực đã được gửi lại! Vui lòng kiểm tra hộp thư của bạn.");
            setShowResendVerification(false);
            setUnverifiedEmail("");
        } catch (error) {
            console.error("Resend verification error:", error);
            const errorMessage = error.message || "Gửi lại email xác thực thất bại. Vui lòng thử lại!";
            showError(errorMessage);
        } finally {
            setResendLoading(false);
            dismiss(loadingToast);
        }
    };

    const handleSubmit = async () => {
        // Validate form
        if (!email.trim() || !password) {
            showError("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        dispatch(clearError());
        setFormErrors({});
        setShowResendVerification(false);

        // Loading toast
        const loadingToast = showLoading("Đang đăng nhập...");

        try {
            await dispatch(loginUser({ email, password })).unwrap();
            showSuccess("Đăng nhập thành công!");
            setTimeout(() => {
                navigate("/");
            }, 2000);
            setShowResendVerification(false);
        } catch (err) {
            // Kiểm tra lỗi email chưa xác thực
            if (err?.statusCode === 403 && err?.message?.includes("Tài khoản chưa được xác minh")) {
                setUnverifiedEmail(email);
                showError("Email của bạn chưa được xác thực. Vui lòng kiểm tra email hoặc gửi lại email xác thực.");
                setShowResendVerification(true);
                console.log("showResendVerification set to true"); // Debug
                return;
            }

            // Kiểm tra lỗi validation
            if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
                console.log("Processing validation errors...");
                const newErrors = {};
                err.errors.forEach((error) => {
                    console.log(`Processing: ${error.path} = ${error.msg}`);
                    newErrors[error.path] = error.msg;
                });
                setFormErrors(newErrors);
                showError(err.errors[0]?.msg || "Vui lòng kiểm tra lại thông tin");
            } else {
                // Lỗi không phải validation
                console.log("Non-validation error");
                showError(err?.message || "Đăng nhập thất bại. Vui lòng thử lại!");
            }
        } finally {
            dismiss(loadingToast);
        }
    };

    const switchToRegister = () => {
        navigate("/register");
    };

    const handleForgotPasswordClick = (e) => {
        e.preventDefault();
        setShowForgotPassword(true);
    };

    return (
        <>
            <Toaster {...toastOptions} />

            {/* Forgot Password Modal */}
            <ForgotPasswordModal
                isOpen={showForgotPassword}
                onClose={() => setShowForgotPassword(false)}
                onSwitchToLogin={() => {
                    setShowForgotPassword(false);
                }}
            />

            {/* Resend Verification Modal */}
            {showResendVerification && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Xác thực Email</h3>
                            <p className="text-sm text-gray-600">
                                Email của bạn chưa được xác thực. Nhập email để gửi lại link xác thực.
                            </p>
                        </div>

                        <div className="mb-4">
                            <InputForm
                                type="email"
                                placeholder="Nhập email của bạn"
                                value={unverifiedEmail}
                                onChange={(e) => setUnverifiedEmail(e.target.value)}
                                disabled={resendLoading}
                            />
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-200"
                                onClick={() => {
                                    setShowResendVerification(false);
                                    setUnverifiedEmail("");
                                }}
                                disabled={resendLoading}
                            >
                                Hủy bỏ
                            </button>
                            <button
                                className={clsx(
                                    "px-4 py-2 text-white rounded-lg font-medium transition duration-200",
                                    resendLoading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-orange-500 hover:bg-orange-600",
                                )}
                                onClick={handleResendVerification}
                                disabled={resendLoading}
                            >
                                {resendLoading ? "Đang gửi..." : "Gửi lại"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
                <div className="mb-8">
                    <div className="flex">
                        <button className="text-black font-semibold pb-2 border-b-2 border-orange-500 mr-8 hover:cursor-pointer">
                            Đăng nhập
                        </button>
                        <button onClick={switchToRegister} className="text-gray-500 pb-2 hover:cursor-pointer">
                            Tạo tài khoản mới
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <InputForm
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (formErrors.email) {
                                setFormErrors((prev) => ({ ...prev, email: null }));
                            }
                        }}
                        disabled={loading}
                        error={formErrors.email}
                    />
                    <div className="relative">
                        <InputForm
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (formErrors.password) {
                                    setFormErrors((prev) => ({ ...prev, password: null }));
                                }
                            }}
                            disabled={loading}
                            error={formErrors.password}
                            className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            disabled={loading}
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                    />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={clsx(
                            "w-full py-3 rounded-lg font-semibold transition duration-200",
                            loading
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-orange-500 text-white hover:bg-orange-600 hover:cursor-pointer",
                        )}
                    >
                        {loading ? "Đang xử lý..." : "Đăng nhập"}
                    </button>
                </div>

                <div className="mt-4 text-center">
                    <button
                        onClick={handleForgotPasswordClick}
                        className="text-blue-500 text-sm hover:underline"
                        disabled={loading}
                    >
                        Bạn quên mật khẩu?
                    </button>
                </div>

                <div className="mt-6 text-xs text-gray-500 text-center">
                    Qua việc đăng nhập hoặc tạo tài khoản, bạn đồng ý với các{" "}
                    <Link to="#" className="text-blue-500 hover:underline">
                        quy định sử dụng
                    </Link>{" "}
                    cũng như{" "}
                    <Link to="#" className="text-blue-500 hover:underline">
                        chính sách bảo mật của chúng tôi
                    </Link>
                </div>

                <div className="mt-4 text-xs text-gray-400 text-center">Sản phẩm © 2015 - 2025 Phongtro123.com</div>
            </div>
        </>
    );
};

export default Login;
