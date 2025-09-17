// Login/index.jsx - Sửa để dùng Redux state
import InputForm from "@/components/InputForm";
import ForgotPasswordModal from "@/pages/ForgotPassword";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
    const [loginSuccess, setLoginSuccess] = useState(false); // Local success state

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    // LẤY REDUX STATE THAY VÌ LOCAL STATE
    const { loading, isLoggedIn, profileUser } = useSelector((state) => state.auth);
    const { showError, showSuccess, showLoading, dismiss, toastOptions } = useToast();

    // Redirect nếu đã đăng nhập (từ persist hoặc vừa login thành công)
    useEffect(() => {
        if (isLoggedIn && !loginSuccess && profileUser) {
            // Đã đăng nhập từ trước (persist), redirect ngay

            navigate("/", { replace: true });
        } else if (loginSuccess && isLoggedIn) {
            // Vừa login thành công, delay trước khi redirect

            const timer = setTimeout(() => {
                navigate("/", { replace: true });
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isLoggedIn, loginSuccess, navigate, profileUser]);

    // Check verification success message from URL state
    useEffect(() => {
        if (location.state?.verificationSuccess) {
            console.log("Showing success toast");
            showSuccess(location.state.message);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state?.verificationSuccess, location.state?.message, navigate]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading || loginSuccess) {
            return;
        }

        // Validate form
        if (!email.trim() || !password) {
            showError("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        console.log("Submitting login with:", { email, password: "***" });

        dispatch(clearError());
        setFormErrors({});
        setShowResendVerification(false);

        const loadingToast = showLoading("Đang đăng nhập...");

        try {
            await dispatch(loginUser({ email, password })).unwrap();

            console.log("Login successful!");
            setLoginSuccess(true); // Set local success state
            showSuccess("Đăng nhập thành công!");

            // Redirect sẽ được handle bởi useEffect
        } catch (err) {
            console.log("Login error details:", err);

            // QUAN TRỌNG: KHÔNG clear input khi có lỗi
            // Chỉ set error messages

            const isUnverifiedError =
                err?.statusCode === 403 ||
                err?.message?.toLowerCase().includes("chưa được xác minh") ||
                err?.message?.toLowerCase().includes("chưa xác thực") ||
                err?.message?.toLowerCase().includes("not verified") ||
                err?.message?.toLowerCase().includes("unverified");

            if (isUnverifiedError) {
                console.log("Email unverified, showing resend verification modal");
                setUnverifiedEmail(email); // Set email từ form
                setShowResendVerification(true);
                showError("Tài khoản của bạn chưa được xác thực. Vui lòng xác thực email trước khi đăng nhập.");
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
                // Lỗi khác
                console.log("Other login error");
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

    const handleCloseResendModal = () => {
        setShowResendVerification(false);
        setUnverifiedEmail("");
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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative transform transition-all duration-300 scale-100">
                        <button
                            onClick={handleCloseResendModal}
                            disabled={resendLoading}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Xác thực Email</h3>
                            <p className="text-sm text-gray-600">
                                Tài khoản của bạn chưa được xác thực. Nhập email để gửi lại link xác thực.
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="text-sm font-medium text-gray-700 block mb-2">Địa chỉ email</label>
                            <InputForm
                                type="email"
                                placeholder="Nhập email của bạn"
                                value={unverifiedEmail}
                                onChange={(e) => setUnverifiedEmail(e.target.value)}
                                disabled={resendLoading}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition duration-200"
                                onClick={handleCloseResendModal}
                                disabled={resendLoading}
                            >
                                Hủy bỏ
                            </button>
                            <button
                                className={clsx(
                                    "flex-1 px-4 py-3 text-white rounded-xl font-medium transition duration-200",
                                    resendLoading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg",
                                )}
                                onClick={handleResendVerification}
                                disabled={resendLoading || !unverifiedEmail.trim()}
                            >
                                {resendLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Đang gửi...</span>
                                    </div>
                                ) : (
                                    "Gửi lại xác thực"
                                )}
                            </button>
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                            <div className="flex items-start space-x-2">
                                <svg
                                    className="w-4 h-4 text-blue-500 mt-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p className="text-xs text-blue-700">
                                    Link xác thực có hiệu lực trong 24 giờ. Kiểm tra cả hộp thư spam nếu không thấy
                                    email.
                                </p>
                            </div>
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

                <form onSubmit={handleSubmit} className="space-y-4">
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
                        disabled={loading || loginSuccess}
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
                            disabled={loading || loginSuccess}
                            error={formErrors.password}
                            className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            disabled={loading || loginSuccess}
                            tabIndex={-1}
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
                        type="submit"
                        disabled={loading || loginSuccess}
                        className={clsx(
                            "w-full py-3 rounded-lg font-semibold transition duration-200",
                            loading || loginSuccess
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-orange-500 text-white hover:bg-orange-600 hover:cursor-pointer",
                        )}
                    >
                        {loading ? "Đang xử lý..." : loginSuccess ? "Đang chuyển hướng..." : "Đăng nhập"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={handleForgotPasswordClick}
                        className="text-blue-500 text-sm hover:underline"
                        disabled={loading || loginSuccess}
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
