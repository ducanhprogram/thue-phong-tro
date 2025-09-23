import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserProfile, updateUserAvatar, clearError } from "@/features/users/userSlice";
import { FaCamera, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

const Profile = () => {
    const dispatch = useDispatch();
    const { profile, loading, updateLoading, avatarLoading } = useSelector((state) => state.user);
    const { profileUser } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        zalo: "",
        facebook_url: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState(null);

    useEffect(() => {
        // Fetch user profile when component mounts
        dispatch(fetchUserProfile());
    }, [dispatch]);

    useEffect(() => {
        // Update form data when profile or profileUser changes
        if (profile) {
            setFormData({
                name: profile.name || "",
                phone: profile.phone || "",
                zalo: profile.zalo || "",
                facebook_url: profile.facebook_url || "",
            });
            setPreviewAvatar(null); // Reset preview when profile updates
        } else if (profileUser) {
            // Fallback to auth profile if user profile is not available
            setFormData({
                name: profileUser.name || "",
                phone: profileUser.phone || "",
                zalo: profileUser.zalo || "",
                facebook_url: profileUser.facebook_url || "",
            });
            setPreviewAvatar(null); // Reset preview when profileUser updates
        }
    }, [profile, profileUser]);

    const showErrorAlert = (message, details = "") => {
        Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: message,
            footer: details ? `<p>${details}</p>` : "",
            confirmButtonColor: "#FF5723",
        });
    };

    const showSuccessAlert = (message) => {
        Swal.fire({
            icon: "success",
            title: "Thành công",
            text: message,
            confirmButtonColor: "#FF5723",
            timer: 2000,
            timerProgressBar: true,
        });
    };

    // Convert file to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // Validate image file
    const validateImageFile = (file) => {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
            showErrorAlert("Định dạng file không được hỗ trợ", "Chỉ chấp nhận file ảnh: JPG, PNG, GIF, WebP");
            return false;
        }

        return true;
    };

    const handleUploadFile = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        // Validate file
        if (!validateImageFile(file)) {
            e.target.value = ""; // Reset input
            return;
        }

        try {
            // Convert to base64
            const base64String = await fileToBase64(file);

            // Set preview immediately
            setPreviewAvatar(base64String);

            // Upload to server
            const response = await dispatch(updateUserAvatar({ avatar: base64String })).unwrap();

            showSuccessAlert("Cập nhật avatar thành công!");

            // Clear preview since avatar is now saved
            setPreviewAvatar(null);
        } catch (error) {
            console.error("Upload avatar failed:", error);
            setPreviewAvatar(null); // Clear preview on error
            showErrorAlert(error.message || "Cập nhật avatar thất bại", error.errors?.join(", ") || "");
        }

        // Reset input to allow same file selection again
        e.target.value = "";
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        // Basic frontend validation
        if (!formData.name.trim()) {
            showErrorAlert("Họ và tên không được để trống");
            return false;
        }
        if (formData.phone && !/^\d{10,11}$/.test(formData.phone)) {
            showErrorAlert("Số điện thoại không hợp lệ", "Số điện thoại phải có 10 hoặc 11 chữ số");
            return false;
        }
        if (formData.facebook_url && !/^(https?:\/\/)?(www\.)?facebook\.com\/.+$/.test(formData.facebook_url)) {
            showErrorAlert("URL Facebook không hợp lệ", "Vui lòng nhập đúng định dạng URL Facebook");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await dispatch(updateUserProfile(formData)).unwrap();
            setIsEditing(false);
            showSuccessAlert("Cập nhật thông tin thành công!");
        } catch (error) {
            console.error("Update failed:", error);
            if (error.statusCode === 409 && error.message.includes("Số điện thoại")) {
                showErrorAlert("Số điện thoại đã được sử dụng", "Vui lòng sử dụng số điện thoại khác");
            } else {
                showErrorAlert(error.message || "Cập nhật thông tin thất bại", error.errors?.join(", ") || "");
            }
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form data to initial values
        if (profile) {
            setFormData({
                name: profile.name || "",
                phone: profile.phone || "",
                zalo: profile.zalo || "",
                facebook_url: profile.facebook_url || "",
            });
        }
        setPreviewAvatar(null); // Reset preview on cancel
        dispatch(clearError());
    };

    // Function to get avatar source (base64 or default)
    const getAvatarSrc = () => {
        if (previewAvatar) return previewAvatar;

        const currentUser = profile || profileUser;
        if (currentUser?.avatar) {
            // If avatar is stored as base64 in database
            if (typeof currentUser.avatar === "string" && currentUser.avatar.startsWith("data:")) {
                return currentUser.avatar;
            }
            return currentUser.avatar;
        }

        return "https://phongtro123.com/images/default-user.svg";
    };

    if (loading && !profile) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const currentUser = profile || profileUser;

    console.log(currentUser);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                    <h1 className="text-2xl font-bold text-white">Thông tin cá nhân</h1>
                    <p className="text-blue-100 mt-1">Quản lý và chỉnh sửa thông tin cá nhân của bạn</p>
                </div>

                <div className="p-6">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative">
                            <div>
                                <img
                                    src={getAvatarSrc()}
                                    alt="Avatar"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                    onError={(e) => {
                                        e.target.src = "https://phongtro123.com/images/default-user.svg";
                                    }}
                                />
                            </div>

                            {avatarLoading && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                </div>
                            )}
                            <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                                <FaCamera size={14} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUploadFile}
                                    className="hidden"
                                    disabled={avatarLoading}
                                />
                            </label>
                        </div>
                        <div className="mt-3 text-center">
                            <h2 className="text-xl font-semibold text-gray-800">{currentUser?.name}</h2>
                            <p className="text-gray-500">ID: {currentUser?.id}</p>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Họ tên */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Họ và tên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                                    placeholder="Nhập họ và tên"
                                    required
                                />
                            </div>

                            {/* Email (readonly) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={currentUser?.email || ""}
                                    disabled
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                />
                                <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi</p>
                            </div>

                            {/* Số điện thoại */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>

                            {/* Zalo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Zalo</label>
                                <input
                                    type="text"
                                    name="zalo"
                                    value={formData.zalo}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                                    placeholder="Nhập số Zalo"
                                />
                            </div>
                        </div>

                        {/* Facebook URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                            <input
                                type="url"
                                name="facebook_url"
                                value={formData.facebook_url}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                                placeholder="https://facebook.com/username"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                            {!isEditing ? (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    <FaEdit size={16} />
                                    Chỉnh sửa
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={updateLoading}
                                        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
                                    >
                                        <FaTimes size={16} />
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updateLoading}
                                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
                                    >
                                        {updateLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Đang lưu...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave size={16} />
                                                Lưu thay đổi
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
