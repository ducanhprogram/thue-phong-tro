const InputForm = ({ type, placeholder, value, onChange, disabled, error }) => {
    return (
        <div className="w-full">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                // MỚI: Thêm class CSS để viền input chuyển sang màu đỏ khi có lỗi
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none bg-gray-50 transition-colors ${
                    error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-orange-500"
                }`}
            />
            {/* MỚI: Hiển thị thẻ <p> chứa thông báo lỗi nếu có */}
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default InputForm;
