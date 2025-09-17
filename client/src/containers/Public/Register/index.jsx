import InputForm from "@/components/InputForm";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, clearError } from "@/features/auth/authSlice";
import useToast from "@/utils/useToast";
import clsx from "clsx";
import { Toaster } from "react-hot-toast";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        password: false,
        confirmPassword: false,
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formErrors, setFormErrors] = useState({});

    // Sử dụng Redux state thay vì local state
    const { loading, isLoggedIn } = useSelector((state) => state.auth);
    const { showSuccess, showError, showLoading, dismiss, toastOptions } = useToast();

    // Handle redirect nếu đã đăng nhập từ trước
    useEffect(() => {
        if (isLoggedIn && !registerSuccess) {
            // Đã đăng nhập từ trước, redirect ngay
            console.log("Already logged in, redirecting from register...");
            navigate("/", { replace: true });
        } else if (registerSuccess) {
            // Vừa đăng ký thành công, delay redirect
            const timer = setTimeout(() => {
                navigate("/login", { state: { email, needVerification: true } });
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isLoggedIn, registerSuccess, navigate, email]);

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    // Validate theo backend regex pattern
    const validatePhone = (phoneNumber) => {
        const vietnamesePhoneRegex = /^(\+84|84|0)(3[2-9]|5[2689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/;
        const cleanPhone = phoneNumber.replace(/[\s\-.]/g, "");
        return vietnamesePhoneRegex.test(cleanPhone);
    };

    const validatePassword = (password) => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        return strongPasswordRegex.test(password);
    };

    const validateName = (name) => {
        const nameRegex = /^[\p{L} ]+$/u; // Unicode letters và dấu cách
        return name.length >= 2 && name.length <= 50 && nameRegex.test(name.trim());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading || registerSuccess) {
            return;
        }

        console.log("=== REGISTER FORM SUBMIT ===");
        console.log("Form data:", {
            fullName,
            email,
            phone,
            password: password ? "has value" : "empty",
            confirmPassword: confirmPassword ? "has value" : "empty",
        });

        // Validate form theo backend requirements
        const errors = {};

        // Validate name
        if (!fullName.trim()) {
            errors.name = "Tên không được để trống";
        } else if (!validateName(fullName)) {
            errors.name = "Tên phải có độ dài từ 2-50 ký tự và chỉ chứa chữ cái";
        }

        // Validate email
        if (!email.trim()) {
            errors.email = "Email không được để trống";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Email không hợp lệ";
        }

        // Validate phone
        if (!phone.trim()) {
            errors.phone = "Số điện thoại không được để trống";
        } else if (!validatePhone(phone)) {
            errors.phone = "Số điện thoại không đúng định dạng. VD: 0987654321, +84987654321";
        }

        // Validate password
        if (!password) {
            errors.password = "Mật khẩu không được để trống";
        } else if (!validatePassword(password)) {
            errors.password = "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
        }

        // Validate confirm password
        if (!confirmPassword) {
            errors.confirmPassword = "Vui lòng nhập lại mật khẩu";
        } else if (password && confirmPassword && password !== confirmPassword) {
            errors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            const firstError = errors.name || errors.email || errors.phone || errors.password || errors.confirmPassword;
            showError(firstError);
            return;
        }

        dispatch(clearError());
        setFormErrors({});

        const loadingToast = showLoading("Đang tạo tài khoản...");

        try {
            await dispatch(
                registerUser({
                    name: fullName.trim(),
                    email: email.trim(),
                    password,
                    phone: phone.trim(),
                }),
            ).unwrap();

            setRegisterSuccess(true);
            showSuccess("Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.", {
                duration: 4000,
            });
        } catch (err) {
            // Handle backend validation errors
            if (err?.errors && Array.isArray(err.errors)) {
                const newErrors = {};
                err.errors.forEach((error) => {
                    console.log(`Validation error: ${error.path} = ${error.msg}`);
                    newErrors[error.path] = error.msg;
                });
                setFormErrors(newErrors);
                const firstError =
                    newErrors.email || newErrors.phone || newErrors.name || newErrors.password || err.message;
                showError(firstError);
            } else {
                showError(err?.message || "Đăng ký thất bại. Vui lòng thử lại!");
            }
        } finally {
            dismiss(loadingToast);
        }
    };

    const switchToLogin = () => {
        navigate("/login");
    };

    // Format phone number display (add spaces for better UX)
    const formatPhoneDisplay = (value) => {
        if (!value) return "";
        const numbers = value.replace(/\D/g, "");

        if (numbers.length >= 7) {
            return numbers.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
        } else if (numbers.length >= 4) {
            return numbers.replace(/(\d{4})(\d+)/, "$1 $2");
        }
        return numbers;
    };

    return (
        <>
            <Toaster {...toastOptions} />
            <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
                <div className="mb-8">
                    <div className="flex">
                        <button
                            onClick={switchToLogin}
                            className={clsx("text-gray-500 pb-2 mr-8 hover:cursor-pointer")}
                        >
                            Đăng nhập
                        </button>
                        <button
                            className={clsx(
                                "text-black font-semibold pb-2 border-b-2 border-orange-500 hover:cursor-pointer",
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
                            if (formErrors.name) {
                                setFormErrors((prev) => ({ ...prev, name: null }));
                            }
                        }}
                        disabled={loading || registerSuccess}
                        error={formErrors.name}
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
                        disabled={loading || registerSuccess}
                        error={formErrors.email}
                    />

                    <InputForm
                        type="tel"
                        placeholder="Số điện thoại (VD: 0987654321)"
                        value={formatPhoneDisplay(phone)}
                        onChange={(e) => {
                            // Chỉ lưu số thuần vào state
                            const value = e.target.value.replace(/\D/g, "");
                            setPhone(value);
                            if (formErrors.phone) {
                                setFormErrors((prev) => ({ ...prev, phone: null }));
                            }
                        }}
                        disabled={loading || registerSuccess}
                        error={formErrors.phone}
                        maxLength="13" // 0987 654 321 = 13 chars with spaces
                    />

                    <div className="relative">
                        <InputForm
                            type={showPasswords.password ? "text" : "password"}
                            placeholder="Mật khẩu (ít nhất 8 ký tự, có chữ hoa, thường, số, ký tự đặc biệt)"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (formErrors.password) {
                                    setFormErrors((prev) => ({ ...prev, password: null }));
                                }
                            }}
                            disabled={loading || registerSuccess}
                            error={formErrors.password}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility("password")}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            disabled={loading || registerSuccess}
                            tabIndex={-1}
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
                            disabled={loading || registerSuccess}
                            error={formErrors.confirmPassword}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility("confirmPassword")}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            disabled={loading || registerSuccess}
                            tabIndex={-1}
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
                        disabled={loading || registerSuccess}
                        className={clsx(
                            "w-full py-3 rounded-lg font-semibold transition duration-200",
                            loading || registerSuccess
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-orange-500 text-white hover:bg-orange-600 hover:cursor-pointer",
                        )}
                    >
                        {loading ? "Đang xử lý..." : registerSuccess ? "Đang chuyển hướng..." : "Tạo tài khoản"}
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
