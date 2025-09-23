export const createPostValidationRules = {
    categoryCode: [
        {
            validator: (value) => {
                if (!value || value.trim() === "") {
                    return "Vui lòng chọn loại chuyên mục";
                }
                return null;
            },
        },
    ],
    title: [
        {
            validator: (value) => {
                if (!value || value.trim() === "") {
                    return "Vui lòng nhập tiêu đề";
                }
                if (value.length > 255) {
                    return "Tiêu đề không được vượt quá 255 ký tự";
                }
                if (value.length < 10) {
                    return "Tiêu đề phải có ít nhất 10 ký tự";
                }
                return null;
            },
        },
    ],
    description: [
        {
            validator: (value) => {
                if (!value || value.trim() === "") {
                    return "Vui lòng nhập nội dung mô tả";
                }
                if (value.length > 3000) {
                    return "Mô tả không được vượt quá 3000 ký tự";
                }
                if (value.length < 20) {
                    return "Mô tả phải có ít nhất 20 ký tự";
                }
                return null;
            },
        },
    ],
    priceNumber: [
        {
            validator: (value) => {
                if (!value || value.toString().trim() === "") {
                    return "Vui lòng nhập giá cho thuê";
                }
                const numValue = parseFloat(value);
                if (isNaN(numValue)) {
                    return "Giá cho thuê phải là số";
                }
                if (numValue <= 0) {
                    return "Giá cho thuê phải lớn hơn 0";
                }
                if (numValue > 1000000000) {
                    return "Giá cho thuê quá lớn";
                }
                return null;
            },
        },
    ],
    areaNumber: [
        {
            validator: (value) => {
                if (!value || value.toString().trim() === "") {
                    return "Vui lòng nhập diện tích";
                }
                const numValue = parseFloat(value);
                if (isNaN(numValue)) {
                    return "Diện tích phải là số";
                }
                if (numValue <= 0) {
                    return "Diện tích phải lớn hơn 0";
                }
                if (numValue > 10000) {
                    return "Diện tích quá lớn (tối đa 10,000 m²)";
                }
                return null;
            },
        },
    ],
    address: [
        {
            validator: (value) => {
                if (!value || value.trim() === "") {
                    return "Vui lòng nhập địa chỉ cho thuê";
                }
                if (value.length < 10) {
                    return "Địa chỉ quá ngắn (ít nhất 10 ký tự)";
                }
                return null;
            },
        },
    ],
    province: [
        {
            validator: (value, payload) => {
                if (!value || value.trim() === "") {
                    return "Vui lòng chọn tỉnh/thành phố";
                }
                return null;
            },
        },
    ],
    images: [
        {
            validator: (value) => {
                if (!value || !Array.isArray(value) || value.length === 0) {
                    return "Vui lòng tải lên ít nhất 1 hình ảnh";
                }
                if (value.length > 10) {
                    return "Tối đa 10 hình ảnh";
                }
                return null;
            },
        },
    ],
    target: [
        {
            validator: (value) => {
                if (!value || value.trim() === "") {
                    return "Vui lòng chọn đối tượng cho thuê";
                }
                return null;
            },
        },
    ],
};
