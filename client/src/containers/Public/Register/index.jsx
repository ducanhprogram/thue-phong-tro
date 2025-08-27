import InputForm from "@/components/InputForm";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, clearError } from "@/features/auth/authSlice";
import useToast from "@/utils/useToast";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPasswords, setShowPasswords] = useState({
        password: false,
        confirmPassword: false,
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formErrors, setFormErrors] = useState({});
    const { loading } = useSelector((state) => state.auth);
    const { showSuccess, showError, showLoading, dismiss, toastOptions } = useToast();

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn chặn reload trang khi submit form

        // Validate form
        if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
            showError("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        if (password !== confirmPassword) {
            showError("Mật khẩu xác nhận không khớp!");
            return;
        }

        dispatch(clearError());
        setFormErrors({});

        // Loading toast
        const loadingToast = showLoading("Đang tạo tài khoản...");

        try {
            await dispatch(registerUser({ name: fullName, email, password })).unwrap();

            showSuccess("Đăng ký thành công! 🎉\nVui lòng kiểm tra email để xác thực tài khoản.", {
                duration: 4000,
            });

            // Chuyển sang trang login sau 2 giây
            setTimeout(() => {
                navigate("/login", { state: { email, needVerification: true } });
            }, 2000);
        } catch (err) {
            console.log("=== REGISTER ERROR DEBUG ===");
            console.log("err:", err);
            console.log("err.errors:", err?.errors);
            console.log("Array.isArray(err?.errors):", Array.isArray(err?.errors));

            // Kiểm tra xem có phải validation error không
            if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
                console.log("Processing validation errors...");

                const newErrors = {};
                err.errors.forEach((error) => {
                    console.log(`Processing: ${error.path} = ${error.msg}`);
                    if (error.path === "name") {
                        newErrors.fullName = error.msg;
                    } else if (error.path === "email") {
                        newErrors.email = error.msg;
                    } else if (error.path === "password") {
                        newErrors.password = error.msg;
                    } else {
                        newErrors[error.path] = error.msg;
                    }
                });

                setFormErrors(newErrors);

                // Hiển thị toast với message cụ thể từ validation error đầu tiên
                const firstError = err.errors[0];
                showError(firstError?.msg || err.message || "Vui lòng kiểm tra lại thông tin");
            } else {
                // Lỗi không phải validation
                console.log("Non-validation error");
                showError(err?.message || "Đăng ký thất bại. Vui lòng thử lại!");
            }
        } finally {
            dismiss(loadingToast);
        }
    };

    const switchToLogin = () => {
        navigate(`/login`);
    };

    return (
        <>
            <Toaster {...toastOptions} />
            <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
                <div className="mb-8">
                    <div className="flex">
                        <button
                            onClick={switchToLogin}
                            className={clsx(`text-gray-500 pb-2 mr-8 hover:cursor-pointer`)}
                        >
                            Đăng nhập
                        </button>
                        <button
                            className={clsx(
                                `text-black font-semibold pb-2 border-b-2 border-orange-500 hover:cursor-pointer`,
                            )}
                        >
                            Tạo tài khoản mới
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputForm
                        type="text"
                        placeholder="Họ và tên"
                        value={fullName}
                        onChange={(e) => {
                            setFullName(e.target.value);
                            if (formErrors.fullName) {
                                setFormErrors((prev) => ({ ...prev, fullName: null }));
                            }
                        }}
                        disabled={loading}
                        error={formErrors.fullName}
                    />
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
                            type={showPasswords.password ? "text" : "password"}
                            placeholder="Mật khẩu (tối thiểu 8 ký tự)"
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
                    <div className="relative">
                        <InputForm
                            type={showPasswords.confirmPassword ? "text" : "password"}
                            placeholder="Nhập lại mật khẩu"
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
                    <button
                        type="submit"
                        disabled={loading}
                        className={clsx(
                            "w-full py-3 rounded-lg font-semibold transition duration-200",
                            loading
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-orange-500 text-white hover:bg-orange-600 hover:cursor-pointer",
                        )}
                    >
                        {loading ? "Đang xử lý..." : "Tạo tài khoản"}
                    </button>
                </form>

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

export default Register;
