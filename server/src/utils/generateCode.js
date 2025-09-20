require("dotenv").config();

const generateCode = (value) => {
    let output = "";
    value = value
        .normalize("NFD") // Chuẩn hóa chuỗi, loại bỏ dấu tiếng Việt
        .replace(/[\u0300-\u036f]/g, "") // Xóa các ký tự dấu
        .split(" ") // Tách chuỗi thành mảng dựa trên khoảng trắng
        .join(""); // Nối lại thành chuỗi không có khoảng trắng
    let merge = value + process.env.phongtro123;
    let length = merge.length;
    // adc + phongtro123 = adcphongtro123
    for (let i = 0; i < 3; i++) {
        let index =
            i === 2
                ? Math.floor(merge.length / 2 + length / 2)
                : Math.floor(length / 2);
        output += merge.charAt(index);
        length = index;
    }
    return `${value.charAt(2)}${output}`.toUpperCase();
};

module.exports = generateCode;
