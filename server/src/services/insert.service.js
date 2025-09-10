const db = require("../models");
const bcrypt = require("bcryptjs");
const chothuematbang = require("../../data/chothuematbang.json");
const chothuecanho = require("../../data/chothuecanho.json");
const nhachothue = require("../../data/nhachothue.json");
const chothuephongtro = require("../../data/chothuephongtro.json");
const generateCode = require("@/utils/generateCode");
const { dataPrice, dataArea } = require("@/utils/data");
const {
    getNumberFromString,
    getNumberFromStringV2,
} = require("@/utils/common");
require("dotenv").config();

const dataBody = [
    {
        body: chothuephongtro.body,
        code: "CTPT",
    },
    {
        body: chothuematbang.body,
        code: "CTMB",
    },
    {
        body: chothuecanho.body,
        code: "CTCH",
    },
    {
        body: nhachothue.body,
        code: "NCT",
    },
];

const hashPassword = (password) =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(12));

const insertService = () =>
    new Promise(async (resolve, reject) => {
        try {
            const provinceCodes = [];

            const labelCodes = [];

            // Sử dụng for...of thay vì forEach để đảm bảo tuần tựss
            for (const cate of dataBody) {
                for (const item of cate.body) {
                    let labelCode = generateCode(
                        item?.header?.class?.classType
                    ).trim();
                    labelCodes?.every((item) => item?.code !== labelCode) &&
                        labelCodes.push({
                            code: labelCode,
                            value: item?.header?.class?.classType?.trim(),
                        });
                    let provinceCode = generateCode(
                        item?.header?.address?.split(",")?.slice(-1)[0]
                    ).trim();
                    provinceCodes?.every(
                        (item) => item?.code !== provinceCode
                    ) &&
                        provinceCodes.push({
                            code: provinceCode,
                            value: item?.header?.address
                                ?.split(",")
                                ?.slice(-1)[0]
                                .trim(),
                        });

                    let desc = JSON.stringify(item?.mainContent?.content);
                    let currentArea = getNumberFromString(
                        item?.header?.attributes?.acreage
                    );
                    let currentPrice = getNumberFromString(
                        item?.header?.attributes?.price
                    );

                    // Tạo Attribute trước và lấy ID
                    const attribute = await db.Attribute.create({
                        // Không truyền id, để autoincrement tự tạo
                        price: item?.header?.attributes?.price,
                        acreage: item?.header?.attributes?.acreage,
                        published: item?.header?.attributes?.published,
                        hashtag: item?.header?.attributes?.hashtag,
                    });

                    // Tạo Image và lấy ID
                    const image = await db.Image.create({
                        // Không truyền id, để autoincrement tự tạo
                        image: JSON.stringify(item?.images),
                    });

                    // Tạo Overview và lấy ID
                    const overview = await db.Overview.create({
                        // Không truyền id, để autoincrement tự tạo
                        code: item?.overview?.content.find(
                            (i) => i.name === "Mã tin:"
                        )?.content,
                        area: item?.overview?.content.find(
                            (i) => i.name === "Khu vực"
                        )?.content,
                        type: item?.overview?.content.find(
                            (i) => i.name === "Loại tin rao:"
                        )?.content,
                        target: item?.overview?.content.find(
                            (i) => i.name === "Đối tượng thuê:"
                        )?.content,
                        bonus: item?.overview?.content.find(
                            (i) => i.name === "Gói tin:"
                        )?.content,
                        created: item?.overview?.content.find(
                            (i) => i.name === "Ngày đăng:"
                        )?.content,
                        expired: item?.overview?.content.find(
                            (i) => i.name === "Ngày hết hạn:"
                        )?.content,
                    });

                    // Tạo User và lấy ID
                    const user = await db.User.create({
                        // Không truyền id, để autoincrement tự tạo
                        name: item?.contact?.content.find(
                            (i) => i.name === "Liên hệ:"
                        )?.content,
                        password: hashPassword("123456"),
                        phone: item?.contact?.content.find(
                            (i) => i.name === "Điện thoại:"
                        )?.content,
                        zalo: item?.contact?.content.find(
                            (i) => i.name === "Zalo"
                        )?.content,
                    });

                    // Cuối cùng tạo Post với các foreign key
                    await db.Post.create({
                        // Không truyền id, để autoincrement tự tạo
                        title: item?.header?.title,
                        star: item?.header?.star,
                        labelCode,
                        address: item?.header?.address,
                        attributesId: attribute.id, // Sử dụng ID integer vừa tạo
                        categoryCode: cate.code,
                        description: desc,
                        userId: user.id, // Sử dụng ID integer vừa tạo
                        overviewId: overview.id, // Sử dụng ID integer vừa tạo
                        imagesId: image.id, // Sử dụng ID integer vừa tạo
                        areaCode: dataArea.find(
                            (area) =>
                                area.max > currentArea &&
                                area.min <= currentArea
                        )?.code,
                        priceCode: dataPrice.find(
                            (area) =>
                                area.max > currentPrice &&
                                area.min <= currentPrice
                        )?.code,
                        provinceCode,
                        priceNumber: getNumberFromStringV2(
                            item?.header?.attributes?.price
                        ),
                        areaNumber: getNumberFromStringV2(
                            item?.header?.attributes?.acreage
                        ),
                    });
                }
            }

            // Tạo Province và Label
            for (const item of provinceCodes) {
                await db.Province.create(item);
            }
            for (const item of labelCodes) {
                await db.Label.create(item);
            }

            resolve("Done.");
        } catch (error) {
            reject(error);
        }
    });

const createPricesAndAreas = () =>
    new Promise((resolve, reject) => {
        try {
            dataPrice.forEach(async (item, index) => {
                await db.Price.create({
                    // Không truyền id, để autoincrement tự tạo
                    code: item.code,
                    value: item.value,
                    order: index + 1,
                });
            });
            dataArea.forEach(async (item, index) => {
                await db.Area.create({
                    // Không truyền id, để autoincrement tự tạo
                    code: item.code,
                    value: item.value,
                    order: index + 1,
                });
            });
            resolve("OK");
        } catch (err) {
            reject(err);
        }
    });

// CommonJS exports
module.exports = {
    insertService,
    createPricesAndAreas,
};
