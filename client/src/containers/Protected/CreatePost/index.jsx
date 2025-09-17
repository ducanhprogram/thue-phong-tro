import Address from "@/components/Address";
import ThongTinMoTa from "@/components/ThongTinMoTa";
import { useState } from "react";
// 1. Import icon từ thư viện react-icons
import { FiCamera } from "react-icons/fi";
import { uploadMultipleImages } from "@/services/postService";

const CreatePost = () => {
    const [payload, setPayload] = useState({
        categoryCode: "",
        title: "",
        priceNumber: "",
        areaNumber: "",
        image: "",
        address: "",
        priceCode: "",
        areaCode: "",
        description: "",
        target: "",
        province: "",
    });

    const handleFiles = async (e) => {
        e.stopPropagation();
        let files = Array.from(e.target.files);
        if (files.length === 0) return;
        try {
            const uploadedImages = await uploadMultipleImages(files);
            console.log("Upload successful:", uploadedImages);
        } catch (error) {
            console.error("Upload images failed:", error.message);
        }
    };
    console.log(payload);
    return (
        <div className="px-6">
            <h1 className="text-2xl py-4 border-b border-gray-200">Đăng tin cho thuê</h1>
            <div className="flex gap-4">
                <div className="py-4 flex flex-col gap-8 flex-auto">
                    <Address payload={payload} setPayload={setPayload} />
                    <ThongTinMoTa payload={payload} setPayload={setPayload} />
                    <div className="font-medium text-xl flex flex-col gap-2">
                        <h2 className="font-semibold text-xl">Hình ảnh</h2>
                        <small className="font-normal text-sm text-gray-500">
                            Cập nhật hình ảnh rõ ràng sẽ cho thuê nhanh hơn
                        </small>
                        <div className="w-full">
                            <label
                                htmlFor="file"
                                className="w-full flex flex-col items-center justify-center gap-3 h-[200px] border-2 border-dashed border-blue-400 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors"
                            >
                                <FiCamera className="text-6xl text-blue-500" />
                                <span className="font-medium text-gray-700 text-sm">Tải ảnh từ thiết bị</span>
                            </label>
                            <input hidden type="file" id="file" multiple onChange={handleFiles} />
                        </div>
                    </div>
                </div>
                <div className="w-[30%]">Mapping</div>
            </div>
        </div>
    );
};

export default CreatePost;
