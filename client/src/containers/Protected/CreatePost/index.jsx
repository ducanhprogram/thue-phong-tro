import Address from "@/components/Address";
import ThongTinMoTa from "@/components/ThongTinMoTa";
import { useState } from "react";
// 1. Import icon từ thư viện react-icons
import { FiCamera } from "react-icons/fi";
import { apiCreatePost, uploadMultipleImages } from "@/services/postService";
import { IoClose } from "react-icons/io5";
import { PropagateLoader } from "react-spinners";
import Button from "@/components/Button";
import { getCodes, getCodesArea } from "@/utils/Common/getCodes";
import { useSelector, useDispatch } from "react-redux";
import { targets } from "@/utils/targets";
import Swal from "sweetalert2";
import {
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedWard,
    clearDistricts,
    clearWards,
    clearSearchResults,
} from "@/features/province/provinceSlice";

const CreatePost = ({ dataEdit }) => {
    const dispatch = useDispatch();
    const [upload, setUpload] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Thêm state loading cho submit
    const [resetKey, setResetKey] = useState(0); // Key để force re-render components
    const { prices, categories } = useSelector((state) => state.app);
    // const { provinces } = useSelector((state) => state.provinces);
    const { areas } = useSelector((state) => state.areas);
    const { profileUser } = useSelector((state) => state.auth);

    const initialPayload = {
        categoryCode: dataEdit?.categoryCode || "",
        title: dataEdit?.title || "",
        priceNumber: +dataEdit?.priceNumber * 1000000 || "",
        areaNumber: dataEdit?.areaNumber || "",
        images: dataEdit?.images || "",
        address: dataEdit?.address || "",
        priceCode: dataEdit?.priceCode || "",
        areaCode: dataEdit?.areaCode || "",
        description: dataEdit?.description || "",
        target: dataEdit?.overviews.target || "",
        province: dataEdit?.province || "",
    };

    const [payload, setPayload] = useState(initialPayload);

    const handleFiles = async (e) => {
        e.stopPropagation();
        let images = [];

        let files = Array.from(e.target.files);
        if (files.length === 0) return;
        // Bắt đầu loading
        setIsUploading(true);

        try {
            const uploadedImages = await uploadMultipleImages(files);
            console.log(uploadedImages);
            images = uploadedImages
                .filter((res) => res.status === 200) // chỉ lấy những cái upload thành công
                .map((res) => res.data?.secure_url);

            setUpload((prev) => [...prev, ...images]);
            setPayload((prev) => ({
                ...prev,
                images: [...upload, ...images],
            }));
        } catch (error) {
            console.log("Upload failed: ", error);
            // Hiển thị thông báo lỗi khi upload ảnh thất bại
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

    const handleRemoveImage = (indexToRemove) => {
        setUpload((prev) => {
            return prev.filter((_, index) => {
                return index !== indexToRemove;
            });
        });

        setPayload((prev) => {
            const currrentImages = Array.isArray(prev.images) ? prev.images : [];
            const newImages = currrentImages.filter((_, index) => {
                return index !== indexToRemove;
            });
            return {
                ...prev,
                images: newImages,
            };
        });
    };

    console.log(payload);

    // Hàm reset form về trạng thái ban đầu
    const resetForm = () => {
        // Reset payload
        setPayload(initialPayload);
        setUpload([]);

        // Reset Redux state cho Address component
        dispatch(setSelectedProvince(null));
        dispatch(setSelectedDistrict(null));
        dispatch(setSelectedWard(null));
        dispatch(clearDistricts());
        dispatch(clearWards());
        dispatch(clearSearchResults());

        // Tăng key để force re-render components
        setResetKey((prev) => prev + 1);

        // Reset file input
        const fileInput = document.getElementById("file");
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true); // Bắt đầu loading

        try {
            let priceCodeArr = getCodes(+payload.priceNumber / Math.pow(10, 6), prices, 1, 15);
            let priceCode = priceCodeArr[0]?.code;
            let areaCodeArr = getCodesArea(+payload.areaNumber, areas, 0, 90);
            let areaCode = areaCodeArr[0]?.code;

            const targetValue = targets.find((target) => target.code === payload.target)?.value || payload.target;

            const submitPayload = {
                ...payload,
                userId: profileUser.id,
                priceCode,
                areaCode,
                target: targetValue,
                priceNumber: parseFloat(payload.priceNumber / Math.pow(10, 6)) || 0,
                areaNumber: parseFloat(payload.areaNumber) || 0,
                label: `${categories?.find((item) => item.code === payload?.categoryCode)?.value}${
                    payload?.address?.split(",")[1]
                }`,
            };

            const response = await apiCreatePost(submitPayload);
            console.log(response);

            // Kiểm tra response và hiển thị thông báo tương ứng
            if (response && response.success) {
                // Thành công
                await Swal.fire({
                    icon: "success",
                    title: "Thành công!",
                    text: response.message || "Tạo bài viết thành công",
                    confirmButtonColor: "#FF5723",
                    timer: 2000,
                    timerProgressBar: true,
                });

                // Reset form sau khi thành công
                resetForm();
            } else {
                // Lỗi từ backend nhưng không throw error
                Swal.fire({
                    icon: "error",
                    title: "Có lỗi xảy ra!",
                    text: response?.message || "Tạo bài viết thất bại",
                    confirmButtonColor: "#FF5723",
                });
            }
        } catch (error) {
            console.log("Create post error: ", error);

            // Hiển thị thông báo lỗi
            Swal.fire({
                icon: "error",
                title: "Có lỗi xảy ra!",
                text: error.message || "Tạo bài viết thất bại",
                confirmButtonColor: "#FF5723",
            });
        } finally {
            setIsSubmitting(false); // Kết thúc loading
        }
    };

    return (
        <div className="px-6 flex justify-center">
            <div className="w-full max-w-4xl">
                <h1
                    className={`text-3xl font-bold py-4 border-b border-gray-200
                  bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}
                >
                    Tạo tin đăng
                </h1>

                <div className="py-4 flex flex-col gap-8">
                    <Address key={`address-${resetKey}`} payload={payload} setPayload={setPayload} />
                    <ThongTinMoTa key={`thongtin-${resetKey}`} payload={payload} setPayload={setPayload} />
                    <div className="font-medium text-xl flex flex-col gap-2">
                        <h2 className="font-semibold text-xl">Hình ảnh</h2>
                        <small className="font-normal text-sm text-gray-500">
                            Cập nhật hình ảnh rõ ràng sẽ cho thuê nhanh hơn
                        </small>
                        <div className="w-full mb-6">
                            <label
                                htmlFor="file"
                                className={`w-full flex flex-col items-center justify-center gap-3 h-[200px] border-2 border-dashed border-blue-400
                                 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors ${
                                     isUploading || isSubmitting
                                         ? "bg-gray-100 cursor-not-allowed"
                                         : "cursor-pointer bg-blue-50 hover:bg-blue-100"
                                 } `}
                            >
                                {isUploading ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <PropagateLoader color="#3b82f6" size={15} />
                                        <span className="font-medium text-gray-600 text-sm">Đang tải ảnh lên...</span>
                                    </div>
                                ) : (
                                    <>
                                        <FiCamera className="text-6xl text-blue-500" />
                                        <span className="font-medium text-gray-700 text-sm">Tải ảnh từ thiết bị</span>
                                    </>
                                )}
                            </label>
                            <input
                                hidden
                                type="file"
                                id="file"
                                multiple
                                onChange={handleFiles}
                                disabled={isUploading || isSubmitting}
                            />
                            {/* Hiển thị ảnh */}
                            {upload.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {upload.map((imageUrl, index) => {
                                        return (
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
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <Button
                            onClick={handleSubmit}
                            text={isSubmitting ? "Đang tạo..." : "Tạo mới"}
                            bgColor="bg-[#FF5723]"
                            textColor="text-white"
                            fontSize="text-[16px]"
                            disabled={isSubmitting || isUploading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
