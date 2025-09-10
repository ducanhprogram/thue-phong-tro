const path = require("path");
const ejs = require("ejs");

async function loadEmail(template, data) {
    console.log(template, data);
    const emailPath = path.join(__dirname, "..", "emails", `${template}.ejs`);
    const html = await ejs.renderFile(emailPath, data);
    // Gọi ejs.renderFile để đọc file EJS tại emailPath và thay thế các placeholder trong file (như <%= userId %>) bằng giá trị từ object data.
    return html;
}

module.exports = loadEmail;
