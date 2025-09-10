import { formatDistanceToNow, isYesterday } from "date-fns";
import { vi } from "date-fns/locale";

// Hàm định dạng thời gian tương đối
export const formatRelativeTime = (isoString) => {
    if (!isoString) return "N/A";

    const date = new Date(isoString);
    const now = new Date(); // Thời gian hiện tại

    // Nếu là hôm qua
    if (isYesterday(date)) {
        return "Hôm qua";
    }

    // Tính khoảng cách thời gian và định dạng
    return formatDistanceToNow(date, {
        addSuffix: true, // Thêm "trước" vào cuối (ví dụ: "1 giờ trước")
        locale: vi, // Sử dụng ngôn ngữ tiếng Việt
    });
};
