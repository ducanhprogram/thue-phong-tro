import { useState } from "react";
import { forgotPassword, resendVerifyEmail } from "@/services/authService";
import useToast from "@/utils/useToast";
import InputForm from "@/components/InputForm";
import clsx from "clsx";

const ForgotPasswordModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [showResendVerification, setShowResendVerification] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const { showError, showSuccess, showLoading, dismiss } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate email
        if (!email.trim()) {
            showError("Vui lòng nhập email!");
            setFormErrors({ email: "Email không được để trống" });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setFormErrors({ email: "Định dạng email không hợp lệ" });
            showError("Định dạng email không hợp lệ!");
            return;
        }

        setLoading(true);
        setFormErrors({});
        const loadingToast = showLoading("Đang kiểm tra email...");

        try {
            await forgotPassword(email);

            // Nếu thành công, hiển thị thông báo và chuyển sang trạng thái đã gửi
            setEmailSent(true);
            showSuccess("Link khôi phục mật khẩu đã được gửi đến email của bạn!");
        } catch (error) {
            console.log("Forgot password error:", error);

            // Xử lý các lỗi cụ thể
            if (error.message.includes("không tồn tại")) {
                showError("Email này chưa được đăng ký trong hệ thống!");
                setFormErrors({ email: "Email này chưa được đăng ký" });
            } else if (error.message.includes("chưa được xác minh") || error.message.includes("chưa xác thực")) {
                setShowResendVerification(true);
                showError("Email chưa được xác thực. Vui lòng xác thực email trước!");
                setFormErrors({ email: "Email chưa được xác thực" });
            } else {
                showError(error.message || "Có lỗi xảy ra. Vui lòng thử lại!");
            }
        } finally {
            setLoading(false);
            dismiss(loadingToast);
        }
    };

    const handleResendVerification = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            showError("Vui lòng nhập email!");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setFormErrors({ email: "Định dạng email không hợp lệ" });
            showError("Định dạng email không hợp lệ!");
            return;
        }

        setLoading(true);
        setFormErrors({});
        const loadingToast = showLoading("Đang gửi email xác thực...");

        try {
            await resendVerifyEmail(email);
            showSuccess("Email xác thực đã được gửi lại!");
            setEmailSent(true);
        } catch (error) {
            console.log("Resend verification error:", error);
            showError(error.message || "Gửi email xác thực thất bại. Vui lòng thử lại!");
        } finally {
            setLoading(false);
            dismiss(loadingToast);
        }
    };

    const handleClose = () => {
        setEmail("");
        setFormErrors({});
        setShowResendVerification(false);
        setEmailSent(false);
        onClose();
    };

    const handleTryAgain = () => {
        setEmailSent(false);
        setShowResendVerification(false);
        setFormErrors({});
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative shadow-2xl transform transition-all duration-300 scale-100 border border-gray-100">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    disabled={loading}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 disabled:opacity-50"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {!emailSent ? (
                    <>
                        {/* Header */}
                        <div className="mb-8 text-center">
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
                                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.414-6.414a6 6 0 018 8.414z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {showResendVerification ? "Xác thực email" : "Quên mật khẩu?"}
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {showResendVerification
                                    ? "Email của bạn chưa được xác thực. Vui lòng xác thực email trước khi khôi phục mật khẩu."
                                    : "Đừng lo lắng! Chúng tôi sẽ gửi link khôi phục mật khẩu đến email của bạn."}
                            </p>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={showResendVerification ? handleResendVerification : handleSubmit}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 block">Địa chỉ email</label>
                                <InputForm
                                    type="email"
                                    placeholder="example@email.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (formErrors.email) {
                                            setFormErrors((prev) => ({ ...prev, email: null }));
                                        }
                                    }}
                                    disabled={loading}
                                    error={formErrors.email}
                                    autoFocus
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                />
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={loading}
                                    className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !email.trim()}
                                    className={clsx(
                                        "flex-1 py-3 px-4 rounded-xl font-medium text-white transition-all duration-200 relative overflow-hidden",
                                        loading || !email.trim()
                                            ? "bg-gray-300 cursor-not-allowed"
                                            : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
                                    )}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Đang xử lý...</span>
                                        </div>
                                    ) : showResendVerification ? (
                                        "Gửi email xác thực"
                                    ) : (
                                        "Gửi link khôi phục"
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                Nhớ lại mật khẩu?{" "}
                                <button
                                    onClick={() => {
                                        handleClose();
                                        onSwitchToLogin();
                                    }}
                                    disabled={loading}
                                    className="text-orange-500 hover:text-orange-600 font-medium hover:underline transition-colors duration-200"
                                >
                                    Đăng nhập ngay
                                </button>
                            </p>
                        </div>
                    </>
                ) : (
                    // Success state
                    <>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg
                                    className="w-10 h-10 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M12 12v7"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">Email đã được gửi!</h2>
                            <p className="text-gray-600 text-sm mb-2">
                                Chúng tôi đã gửi link {showResendVerification ? "xác thực" : "khôi phục mật khẩu"} đến:
                            </p>
                            <p className="text-orange-600 font-semibold mb-6">{email}</p>

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                                <div className="flex items-start space-x-3">
                                    <svg
                                        className="w-5 h-5 text-blue-500 mt-0.5"
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
                                    <div className="text-sm text-blue-700">
                                        <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                                        <ul className="list-disc list-inside space-y-1 text-xs">
                                            <li>Kiểm tra hộp thư spam/junk nếu không thấy email</li>
                                            <li>Link có hiệu lực trong 15 phút</li>
                                            <li>Chỉ có thể sử dụng link một lần duy nhất</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleTryAgain}
                                    className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                                >
                                    Thử email khác
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
