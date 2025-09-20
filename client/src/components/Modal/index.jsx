import { fetchProvinces, fetchProvincesOld } from "@/features/province/provinceSlice";
import icons from "@/utils/icons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Modal.module.scss";
const { MdArrowBack } = icons;

const Modal = ({ onClose, content, name, handleSubmit, selectedValue }) => {
    const dispatch = useDispatch();

    const { provincesOld } = useSelector((state) => state.provinces);

    useEffect(() => {
        // Gọi API nội bộ để lấy provinces

        if (name === "provinces") {
            dispatch(fetchProvincesOld());
        }
    }, [dispatch, name]);

    // useEffect(() => {
    //     if (name === "provinces") {
    //         dispatch(fetchProvinces());
    //     }
    // }, [dispatch, name]);

    useEffect(() => {
        console.log("Modal - name:", name);
        console.log("Modal - content:", content);
        console.log("Modal - selectedValue:", selectedValue);
    }, [name, content, selectedValue]);

    const handleOverlayClick = (e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleItemChange = (e, item) => {
        e.stopPropagation();
        handleSubmit(e, { [name]: item.value, [`${name}Code`]: item.code });
    };

    // Hàm để lấy option mặc định cho mỗi loại
    const getDefaultOption = () => {
        switch (name) {
            case "provinces":
                return { value: "Toàn quốc", code: null };
            case "prices":
                return { value: "Mọi giá", code: null };
            case "areas":
                return { value: "Mọi diện tích", code: null };
            case "category":
                return { value: "Tất cả", code: null };
            default:
                return null;
        }
    };

    const defaultOption = getDefaultOption();
    const isDefaultSelected = !selectedValue || selectedValue === defaultOption?.value;

    return (
        <div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={handleOverlayClick}
        >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-modalSlideIn">
                {/* Header */}
                <div className="h-14 flex items-center px-4 border-b border-gray-100 bg-white">
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                        <MdArrowBack size="20px" className="text-gray-600" />
                    </button>
                    <h3 className="ml-3 text-lg font-semibold text-gray-800">
                        {name === "category" && "Chọn loại nhà đất"}
                        {name === "provinces" && "Chọn tỉnh thành"}
                        {name === "prices" && "Chọn mức giá"}
                        {name === "areas" && "Chọn diện tích"}
                    </h3>
                </div>

                {/* Content */}
                <div className={`max-h-96 overflow-y-auto bg-gray-50 ${styles["custom-scrollbar"]}`}>
                    <div className="p-2">
                        {/* Default Option */}
                        {defaultOption && (
                            <label
                                className={`group flex items-center p-3 mx-2 my-1 bg-white rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-200 border transition-all duration-200 shadow-sm ${
                                    isDefaultSelected ? "border-blue-500 bg-blue-50" : "border-transparent"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name={name}
                                    value={defaultOption.value}
                                    checked={isDefaultSelected}
                                    onChange={(e) => handleItemChange(e, defaultOption)}
                                    className="sr-only"
                                />
                                <div
                                    className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                                        isDefaultSelected
                                            ? "border-blue-500 bg-blue-500"
                                            : "border-gray-300 group-hover:border-blue-500"
                                    }`}
                                >
                                    {isDefaultSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                </div>
                                <span
                                    className={`font-medium transition-colors duration-200 ${
                                        isDefaultSelected ? "text-blue-700" : "text-gray-700 group-hover:text-blue-700"
                                    }`}
                                >
                                    {defaultOption.value}
                                </span>
                            </label>
                        )}

                        {/* Existing Options */}
                        {content && content.length > 0 ? (
                            content.map((item, index) => {
                                const isSelected =
                                    selectedValue === item.value && selectedValue !== defaultOption?.value;
                                return (
                                    <label
                                        key={item.id || item.code || index}
                                        className={`group flex items-center p-3 mx-2 my-1 bg-white rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-200 border transition-all duration-200 shadow-sm ${
                                            isSelected ? "border-blue-500 bg-blue-50" : "border-transparent"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={name}
                                            value={item.value}
                                            checked={isSelected}
                                            onChange={(e) => handleItemChange(e, item)}
                                            className="sr-only"
                                        />
                                        <div
                                            className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                                                isSelected
                                                    ? "border-blue-500 bg-blue-500"
                                                    : "border-gray-300 group-hover:border-blue-500"
                                            }`}
                                        >
                                            {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                        </div>
                                        <span
                                            className={`font-medium transition-colors duration-200 ${
                                                isSelected ? "text-blue-700" : "text-gray-700 group-hover:text-blue-700"
                                            }`}
                                        >
                                            {name === "provinces" && item?.value}
                                            {name === "category" && (item.header || item.value)}
                                            {name === "prices" && item.value}
                                            {name === "areas" && item.value}
                                        </span>
                                    </label>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m8-3v4"
                                        />
                                    </svg>
                                </div>
                                <p className="text-sm">Không có dữ liệu hiển thị</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
