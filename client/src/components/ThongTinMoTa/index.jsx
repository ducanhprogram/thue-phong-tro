//ThongTinMoTa index.jsx - Updated with Debounce
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import InputReadOnly from "../InputReadOnly";
import InputFormV2 from "../InputFormV2";
import Select from "../Select";
import { useDebounce } from "@/hooks/useDebounce";

const targets = [
    { code: "all", value: "Tất cả" },
    { code: "male", value: "Nam" },
    { code: "female", value: "Nữ" },
];

const ThongTinMoTa = ({ payload, setPayload }) => {
    const { categories } = useSelector((state) => state.app);
    const { profileUser } = useSelector((state) => state.auth);

    // State local cho textarea description
    const [localDescription, setLocalDescription] = useState(payload.description || "");

    const debouncedDescription = useDebounce(localDescription, 1000);
    useEffect(() => {
        setLocalDescription(payload.description || "");
    }, [payload.description]);

    // Cập nhật payload khi debounced description thay đổi
    useEffect(() => {
        if (debouncedDescription !== payload.description) {
            setPayload((prev) => ({
                ...prev,
                description: debouncedDescription,
            }));
        }
    }, [debouncedDescription, setPayload, payload.description]);
    const handleDescriptionChange = (e) => {
        setLocalDescription(e.target.value);
    };

    return (
        <div className="font-semibold text-xl py-4">
            <h2 className="text-xl">Thông tin mô tả</h2>
            <div className="mt-3">
                <div className="w-1/2 text-sm">
                    <Select
                        label={"Loại chuyên mục"}
                        value={payload.categoryCode}
                        setValue={setPayload}
                        name="categoryCode"
                        options={categories}
                    />
                </div>

                <div className="mt-4">
                    <InputFormV2 label={"Tiêu đề"} value={payload.title} name="title" setValue={setPayload} />
                </div>

                <div className="flex flex-col gap-2 mt-4">
                    <label htmlFor="desc" className="text-sm font-medium">
                        Nội dung mô tả
                    </label>
                    <textarea
                        placeholder="Nhập nội dung mô tả..."
                        id="desc"
                        cols={"30"}
                        rows={"5"}
                        value={localDescription}
                        onChange={handleDescriptionChange}
                        className="w-full rounded-md border outline-none border-gray-300 p-2 resize-y font-normal pl-2 text-sm"
                    ></textarea>
                </div>

                <div className="w-1/2 flex flex-col gap-4 mt-6 text-sm">
                    <div className="flex flex-col gap-6">
                        <InputReadOnly label="Thông tin liên hệ" value={profileUser?.name} />
                        <InputReadOnly label="Điện thoại" value={profileUser?.phone} />
                        <InputFormV2
                            name="priceNumber"
                            small={"Nhập đầy đủ số, ví dụ 1 triệu thì nhập là 1000000"}
                            label={"Giá cho thuê"}
                            unit={"đồng"}
                            value={+payload.priceNumber}
                            setValue={setPayload}
                        />
                        <InputFormV2
                            name={"areaNumber"}
                            label={"Diện tích"}
                            unit={"m2"}
                            value={+payload.areaNumber}
                            setValue={setPayload}
                        />
                        <Select
                            options={targets}
                            label={"Đối tượng cho thuê"}
                            value={payload.target}
                            setValue={setPayload}
                            name="target"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThongTinMoTa;
