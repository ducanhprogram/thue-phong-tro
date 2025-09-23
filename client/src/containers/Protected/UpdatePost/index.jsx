// UpdatePost.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { FiCamera } from "react-icons/fi";
import { PropagateLoader } from "react-spinners";
import Swal from "sweetalert2";
import Button from "@/components/Button";
import Address from "@/components/Address";
import ThongTinMoTa from "@/components/ThongTinMoTa";
import { uploadMultipleImages } from "@/services/postService";
import { updatePost } from "@/features/posts/postSlice";
import { getCodes, getCodesArea } from "@/utils/Common/getCodes";
import { targets } from "@/utils/targets";
import {
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedWard,
    clearDistricts,
    clearWards,
    clearSearchResults,
    fetchDistricts,
    fetchWards,
} from "@/features/province/provinceSlice";
import formatDateTime from "@/utils/formatDateTime";

const UpdatePost = ({ isOpen, onClose, postData }) => {
    const dispatch = useDispatch();
    const [upload, setUpload] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resetKey, setResetKey] = useState(0);

    const { prices, categories } = useSelector((state) => state.app);
    const { areas } = useSelector((state) => state.areas);
    // const { profileUser } = useSelector((state) => state.auth);
    const { provinces, districts, wards } = useSelector((state) => state.provinces);

    // Parse images từ postData
    const parseImages = (imageData) => {
        try {
            if (typeof imageData === "string") {
                return JSON.parse(imageData);
            }
            return Array.isArray(imageData) ? imageData : [];
        } catch (error) {
            console.error("Error parsing images:", error);
            return [];
        }
    };

    // Parse description từ postData
    const parseDescription = (descriptionData) => {
        try {
            if (typeof descriptionData === "string") {
                try {
                    return JSON.parse(descriptionData);
                } catch {
                    return descriptionData;
                }
            }
            return descriptionData || "";
        } catch (error) {
            console.error("Error parsing description:", error);
            return "";
        }
    };

    // Parse address thành các phần province, district, ward
    const parseAddressParts = (fullAddress) => {
        if (!fullAddress) return { province: "", district: "", ward: "", exactAddress: "" };

        const parts = fullAddress.split(", ");
        if (parts.length >= 4) {
            return {
                exactAddress: parts[0] || "",
                ward: parts[1] || "",
                district: parts[2] || "",
                province: parts[3] || "",
            };
        }
        return { province: "", district: "", ward: "", exactAddress: parts[0] || "" };
    };

    const getInitialPayload = (data) => {
        if (!data) {
            return {
                categoryCode: "",
                title: "",
                priceNumber: "",
                areaNumber: "",
                images: [],
                address: "",
                exactAddress: "",
                priceCode: "",
                areaCode: "",
                description: "",
                target: "",
                province: "",
                district: "",
                ward: "",
            };
        }

        const addressParts = parseAddressParts(data.address);

        return {
            categoryCode: data.categoryCode || "",
            title: data.title || "",
            priceNumber: data.priceNumber ? +data.priceNumber * 1000000 : "",
            areaNumber: data.areaNumber || "",
            images: parseImages(data.images?.image),
            address: data.address || "",
            exactAddress: addressParts.exactAddress,
            priceCode: data.priceCode || "",
            areaCode: data.areaCode || "",
            description: parseDescription(data.description),
            target: parseTargetCode(data.overviews?.target),
            province: addressParts.province,
            district: addressParts.district,
            ward: addressParts.ward,
        };
    };

    const parseTargetCode = (targetValue) => {
        if (!targetValue) return "";
        const targetItem = targets.find((t) => t.value === targetValue);
        return targetItem ? targetItem.code : targetValue;
    };

    const [payload, setPayload] = useState(() => getInitialPayload(postData));

    // Initialize Redux state with province, district, and ward
    useEffect(() => {
        if (isOpen && postData) {
            // Reset Redux state
            dispatch(setSelectedProvince(null));
            dispatch(setSelectedDistrict(null));
            dispatch(setSelectedWard(null));
            dispatch(clearDistricts());
            dispatch(clearWards());
            dispatch(clearSearchResults());

            // Set payload
            const newPayload = getInitialPayload(postData);
            setPayload(newPayload);
            setUpload(parseImages(postData.images?.image));
            setResetKey((prev) => prev + 1);

            // Initialize province, district, and ward
            const addressParts = parseAddressParts(postData.address);
            // Find and set province
            const foundProvince = provinces.find((p) => {
                const cleanProvinceName = p.province_name.replace("Thành phố ", "").replace("Tỉnh ", "").trim();
                const cleanPayloadProvince = addressParts.province
                    .replace("Thành phố ", "")
                    .replace("Tỉnh ", "")
                    .trim();
                return cleanProvinceName === cleanPayloadProvince || p.province_name === addressParts.province;
            });

            if (foundProvince) {
                dispatch(setSelectedProvince(foundProvince));

                // Fetch districts for the selected province
                dispatch(fetchDistricts(foundProvince.province_id)).then((action) => {
                    if (fetchDistricts.fulfilled.match(action)) {
                        // Find and set district
                        const foundDistrict = action.payload.find((d) => {
                            const cleanDistrictName = d.district_name
                                .replace("Quận ", "")
                                .replace("Huyện ", "")
                                .replace("Thị xã ", "")
                                .replace("Thành phố ", "")
                                .trim();
                            const cleanPayloadDistrict = addressParts.district
                                .replace("Quận ", "")
                                .replace("Huyện ", "")
                                .replace("Thị xã ", "")
                                .replace("Thành phố ", "")
                                .trim();
                            return (
                                cleanDistrictName === cleanPayloadDistrict || d.district_name === addressParts.district
                            );
                        });

                        if (foundDistrict) {
                            dispatch(setSelectedDistrict(foundDistrict));

                            // Fetch wards for the selected district
                            dispatch(fetchWards(foundDistrict.district_id)).then((wardAction) => {
                                if (fetchWards.fulfilled.match(wardAction)) {
                                    // Find and set ward
                                    const foundWard = wardAction.payload.find((w) => {
                                        const cleanWardName = w.ward_name
                                            .replace("Phường ", "")
                                            .replace("Xã ", "")
                                            .replace("Thị trấn ", "")
                                            .trim();
                                        const cleanPayloadWard = addressParts.ward
                                            .replace("Phường ", "")
                                            .replace("Xã ", "")
                                            .replace("Thị trấn ", "")
                                            .trim();
                                        return cleanWardName === cleanPayloadWard || w.ward_name === addressParts.ward;
                                    });

                                    if (foundWard) {
                                        dispatch(setSelectedWard(foundWard));
                                    } else {
                                        console.log("Ward not found:", addressParts.ward);
                                    }
                                }
                            });
                        } else {
                            console.log("District not found:", addressParts.district);
                        }
                    }
                });
            } else {
                console.log("Province not found:", addressParts.province);
            }
        }
    }, [isOpen, postData, provinces, dispatch]);

    // Reset form về trạng thái ban đầu của postData
    const resetForm = () => {
        if (!postData) return;
        dispatch(setSelectedProvince(null));
        dispatch(setSelectedDistrict(null));
        dispatch(setSelectedWard(null));
        dispatch(clearDistricts());
        dispatch(clearWards());
        dispatch(clearSearchResults());

        const resetPayload = getInitialPayload(postData);
        setPayload(resetPayload);
        setUpload(parseImages(postData?.images?.image) || []);
        setResetKey((prev) => prev + 1);

        const fileInput = document.getElementById("update-file");
        if (fileInput) {
            fileInput.value = "";
        }
    };

    // Xử lý upload file
    const handleFiles = async (e) => {
        e.stopPropagation();
        let images = [];

        let files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsUploading(true);

        try {
            const uploadedImages = await uploadMultipleImages(files);
            images = uploadedImages.filter((res) => res.status === 200).map((res) => res.data?.secure_url);

            setUpload((prev) => [...prev, ...images]);
            setPayload((prev) => ({
                ...prev,
                images: [...prev.images, ...images],
            }));
        } catch (error) {
            console.log("Upload failed: ", error);
            Swal.fire({
                icon: "error",
                title: "Lỗi upload ảnh!",
                text: "Không thể tải ảnh lên. Vui lòng thử lại.",
                confirmButtonColor: "#FF5723",
            });
        } finally {
            setIsUploading(false);
        }
    };

    // Xóa ảnh
    const handleRemoveImage = (indexToRemove) => {
        setUpload((prev) => prev.filter((_, index) => index !== indexToRemove));
        setPayload((prev) => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove),
        }));
    };

    // Xử lý submit
    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            let priceCodeArr = getCodes(+payload.priceNumber / Math.pow(10, 6), prices, 1, 15);
            let priceCode = priceCodeArr[0]?.code;
            let areaCodeArr = getCodesArea(+payload.areaNumber, areas, 0, 90);
            let areaCode = areaCodeArr[0]?.code;

            const targetValue = targets.find((target) => target.code === payload.target)?.value || payload.target;

            const submitPayload = {
                ...payload,
                priceCode,
                areaCode,
                target: targetValue,
                priceNumber: parseFloat(payload.priceNumber / Math.pow(10, 6)) || 0,
                areaNumber: parseFloat(payload.areaNumber) || 0,
                label: `${categories?.find((item) => item.code === payload?.categoryCode)?.value}${
                    payload?.address?.split(",")[1] || ""
                }`,
            };

            const response = await dispatch(
                updatePost({
                    postId: postData.id,
                    payload: submitPayload,
                }),
            ).unwrap();

            if (response) {
                await Swal.fire({
                    icon: "success",
                    title: "Thành công!",
                    text: "Cập nhật bài viết thành công",
                    confirmButtonColor: "#FF5723",
                    timer: 2000,
                    timerProgressBar: true,
                });
                onClose();
            }
        } catch (error) {
            console.log("Update post error: ", error);
            Swal.fire({
                icon: "error",
                title: "Có lỗi xảy ra!",
                text: error.message || "Cập nhật bài viết thất bại",
                confirmButtonColor: "#FF5723",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Xử lý đóng modal
    const handleClose = () => {
        if (!isSubmitting && !isUploading) {
            resetForm();
            onClose();
        }
    };

    // Xử lý click outside
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            resetForm();
            handleClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-50 p-4"
            onClick={handleOverlayClick}
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Chỉnh sửa tin đăng
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting || isUploading}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <IoClose className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex gap-6">
                        <div className="flex-1 flex flex-col gap-8">
                            {/* Address Component */}
                            <Address key={`address-${resetKey}`} payload={payload} setPayload={setPayload} />

                            {/* ThongTinMoTa Component */}
                            <ThongTinMoTa key={`thongtin-${resetKey}`} payload={payload} setPayload={setPayload} />

                            {/* Images Section */}
                            <div className="flex flex-col gap-4">
                                <h3 className="font-semibold text-xl">Hình ảnh</h3>
                                <small className="text-sm text-gray-500">
                                    Cập nhật hình ảnh rõ ràng sẽ cho thuê nhanh hơn
                                </small>

                                {/* Upload Area */}
                                <div className="w-full">
                                    <label
                                        htmlFor="update-file"
                                        className={`w-full flex flex-col items-center justify-center gap-3 h-[200px] border-2 border-dashed border-blue-400
                                         rounded-lg transition-colors ${
                                             isUploading || isSubmitting
                                                 ? "bg-gray-100 cursor-not-allowed"
                                                 : "cursor-pointer bg-blue-50 hover:bg-blue-100"
                                         }`}
                                    >
                                        {isUploading ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <PropagateLoader color="#3b82f6" size={15} />
                                                <span className="font-medium text-gray-600 text-sm">
                                                    Đang tải ảnh lên...
                                                </span>
                                            </div>
                                        ) : (
                                            <>
                                                <FiCamera className="text-6xl text-blue-500" />
                                                <span className="font-medium text-gray-700 text-sm">
                                                    Tải ảnh từ thiết bị
                                                </span>
                                            </>
                                        )}
                                    </label>
                                    <input
                                        hidden
                                        type="file"
                                        id="update-file"
                                        multiple
                                        onChange={handleFiles}
                                        disabled={isUploading || isSubmitting}
                                    />

                                    {/* Image Preview */}
                                    {upload.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {upload.map((imageUrl, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={imageUrl}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-lg border"
                                                    />
                                                    <button
                                                        onClick={() => handleRemoveImage(index)}
                                                        disabled={isUploading || isSubmitting}
                                                        className="absolute -top-2 -right-2 bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700
                                                            text-white rounded-full w-6 h-6 flex items-center justify-center 
                                                            shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 
                                                            group-hover:opacity-100 opacity-90 border-2 border-white hover:cursor-pointer
                                                            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                                        title="Xóa ảnh"
                                                    >
                                                        <IoClose className="text-lg font-bold drop-shadow-sm" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="w-[25%]">
                            <div className="sticky top-0 bg-gray-50 rounded-lg p-4">
                                <h4 className="font-medium text-gray-700 mb-2">Thông tin bài viết</h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p>ID: {postData?.id}</p>
                                    <p>Mã tin: {postData?.overviews?.code}</p>
                                    <p>Ngày tạo: {formatDateTime(postData?.overviews?.created)}</p>
                                    <p>Hết hạn: {formatDateTime(postData?.overviews?.expired)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50">
                    <Button
                        onClick={handleClose}
                        text="Hủy"
                        bgColor="bg-gray-500"
                        textColor="text-white"
                        disabled={isSubmitting || isUploading}
                    />
                    <Button
                        onClick={handleSubmit}
                        text={isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
                        bgColor="bg-[#FF5723]"
                        textColor="text-white"
                        disabled={isSubmitting || isUploading}
                    />
                </div>
            </div>
        </div>
    );
};

export default UpdatePost;
