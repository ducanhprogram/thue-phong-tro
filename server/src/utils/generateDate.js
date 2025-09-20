// @/utils/generateDate.js
const generateDate = (addDays = 0) => {
    const currentDate = new Date();

    if (addDays > 0) {
        currentDate.setDate(currentDate.getDate() + addDays);
    }

    // Format: DD/MM/YYYY
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();

    return `${day}/${month}/${year}`;
};

module.exports = { generateDate };
