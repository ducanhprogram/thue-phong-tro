import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import InputForm from "@/components/InputForm";
import useToast from "@/utils/useToast";
import { Toaster } from "react-hot-toast";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { resetUserPassword } from "@/features/auth/authSlice";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [password, setPassword] = useState("");
    const { loading } = useSelector((state) => state.auth);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [showPasswords, setShowPasswords] = useState({
        password: false,
        confirmPassword: false,
    });
    const [isSuccess, setIsSuccess] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(true);

    const { showError, showSuccess, showLoading, dismiss, toastOptions } = useToast();

    // Kiểm tra token có hợp lệ không khi component mount
    useEffect(() => {
        if (!token || token.length < 10) {
            setIsTokenValid(false);
        }
    }, [token]);

    const validateForm = () => {
        const errors = {};

        if (!password.trim()) {
            errors.password = "Mật khẩu mới không được để trống";
        } else if (password.length < 8) {
            errors.password = "Mật khẩu phải có ít nhất 8 ký tự";
        }

        if (!confirmPassword.trim()) {
            errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
        } else if (password !== confirmPassword) {
            errors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showError("Vui lòng kiểm tra lại thông tin!");
            return;
        }

        const loadingToast = showLoading("Đang đặt lại mật khẩu...");

        try {
            await dispatch(resetUserPassword({ token, password })).unwrap();
            setIsSuccess(true);
            showSuccess("Đặt lại mật khẩu thành công!");

            // Chuyển hướng về login sau 3 giây
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error) {
            console.log("Reset password error:", error);

            if (error.message.includes("hết hạn")) {
                showError("Link đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu link mới!");
                setIsTokenValid(false);
            } else if (error.message.includes("không hợp lệ")) {
                showError("Link đặt lại mật khẩu không hợp lệ!");
                setIsTokenValid(false);
            } else {
                showError(error.message || "Có lỗi xảy ra. Vui lòng thử lại!");
            }
        } finally {
            dismiss(loadingToast);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    // Nếu token không hợp lệ
    if (!isTokenValid) {
        return (
            <>
                <Toaster {...toastOptions} />
                <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-gray-100">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg
                                className="w-10 h-10 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Link không hợp lệ</h2>
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                            Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới.
                        </p>
                        <Link
                            to="/login"
                            className="inline-block w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg"
                        >
                            Quay về đăng nhập
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    // Nếu đặt lại mật khẩu thành công
    if (isSuccess) {
        return (
            <>
                <Toaster {...toastOptions} />
                <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-gray-100">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg
                                className="w-10 h-10 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Thành công!</h2>
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                            Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng nhập với mật khẩu mới.
                        </p>
                        <p className="text-xs text-gray-500 mb-6">
                            Đang chuyển hướng đến trang đăng nhập trong 3 giây...
                        </p>
                        <Link
                            to="/login"
                            className="inline-block w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
                        >
                            Đăng nhập ngay
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Toaster {...toastOptions} />
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.414-6.414a6 6 0 018 8.414z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-3">Đặt lại mật khẩu</h1>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Nhập mật khẩu mới để hoàn tất quá trình khôi phục tài khoản của bạn.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Mật khẩu mới</label>
                            <div className="relative">
                                <InputForm
                                    type={showPasswords.password ? "text" : "password"}
                                    placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
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
                                    onClick={() => togglePasswordVisibility("password")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    disabled={loading}
                                >
                                    {showPasswords.password ? (
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
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Xác nhận mật khẩu mới</label>
                            <div className="relative">
                                <InputForm
                                    type={showPasswords.confirmPassword ? "text" : "password"}
                                    placeholder="Nhập lại mật khẩu mới"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (formErrors.confirmPassword) {
                                            setFormErrors((prev) => ({ ...prev, confirmPassword: null }));
                                        }
                                    }}
                                    disabled={loading}
                                    error={formErrors.confirmPassword}
                                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility("confirmPassword")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    disabled={loading}
                                >
                                    {showPasswords.confirmPassword ? (
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
                        </div>

                        {/* Password strength indicator */}
                        {password && (
                            <div className="space-y-2">
                                <div className="text-xs font-medium text-gray-600">Độ mạnh mật khẩu:</div>
                                <div className="flex space-x-1">
                                    <div
                                        className={clsx(
                                            "h-2 flex-1 rounded-full transition-colors duration-300",
                                            password.length >= 8 ? "bg-orange-500" : "bg-gray-200",
                                        )}
                                    ></div>
                                    <div
                                        className={clsx(
                                            "h-2 flex-1 rounded-full transition-colors duration-300",
                                            password.length >= 10 && /[A-Z]/.test(password)
                                                ? "bg-orange-500"
                                                : "bg-gray-200",
                                        )}
                                    ></div>
                                    <div
                                        className={clsx(
                                            "h-2 flex-1 rounded-full transition-colors duration-300",
                                            password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)
                                                ? "bg-green-500"
                                                : "bg-gray-200",
                                        )}
                                    ></div>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {password.length < 8 && "Tối thiểu 8 ký tự"}
                                    {password.length >= 8 && password.length < 10 && "Trung bình"}
                                    {password.length >= 10 && /[A-Z]/.test(password) && "Khá mạnh"}
                                    {password.length >= 12 &&
                                        /[A-Z]/.test(password) &&
                                        /[0-9]/.test(password) &&
                                        "Rất mạnh"}
                                </div>
                            </div>
                        )}

                        {/* Submit button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading || !password.trim() || !confirmPassword.trim()}
                                className={clsx(
                                    "w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-200 relative overflow-hidden",
                                    loading || !password.trim() || !confirmPassword.trim()
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
                                )}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Đang xử lý...</span>
                                    </div>
                                ) : (
                                    "Đặt lại mật khẩu"
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Nhớ lại mật khẩu?{" "}
                            <Link
                                to="/login"
                                className="text-orange-500 hover:text-orange-600 font-medium hover:underline transition-colors duration-200"
                            >
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>

                    {/* Security notice */}
                    <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                            <svg
                                className="w-5 h-5 text-gray-500 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                            <div className="text-xs text-gray-600">
                                <p className="font-medium mb-1">Bảo mật tài khoản:</p>
                                <p>
                                    Sau khi đổi mật khẩu, bạn sẽ được đăng xuất khỏi tất cả thiết bị để đảm bảo bảo mật.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
