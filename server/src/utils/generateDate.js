// @/utils/generateDate.js
const generateDate = (addDays = 0) => {
    const currentDate = new Date();

    if (addDays > 0) {
        currentDate.setDate(currentDate.getDate() + addDays);
    }

    return currentDate; // Trả về Date object thay vì string
};

// Nếu bạn vẫn cần format string cho mục đích khác
const generateDateString = (addDays = 0) => {
    const currentDate = new Date();

    if (addDays > 0) {
        currentDate.setDate(currentDate.getDate() + addDays);
    }

    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();

    return `${day}/${month}/${year}`;
};

module.exports = { generateDate, generateDateString };
