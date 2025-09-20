//post.service.js
const {
    Post,
    Image,
    Attribute,
    User,
    Overview,
    Province,
    Label,
} = require("@/models");
const generateCode = require("@/utils/generateCode");
const { generateDate } = require("@/utils/generateDate");
const moment = require("moment");
const { Op } = require("sequelize");

class PostService {
    async getPosts() {
        try {
            const response = await Post.findAll({
                raw: true,
                nest: true,
                include: [
                    { model: Image, as: "images", attributes: ["image"] },
                    {
                        model: User,
                        as: "user",
                        attributes: {
                            exclude: [
                                "password",
                                "email_verified",
                                "email_verified_at",
                            ],
                        },
                    },

                    {
                        model: Attribute,
                        as: "attributes",
                        attributes: [
                            "price",
                            "acreage",
                            "published",
                            "hashtag",
                        ],
                    },
                ],
            });
            if (!response.length) {
                const error = new Error("Không tìm thấy bài viết nào");
                error.statusCode = 404;
                throw error;
            }
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getPostsLimit(
        page = 1,
        limit = 10,
        priceCode,
        areaCode,
        categoryCode,
        provinceCode
    ) {
        try {
            const offset = (page - 1) * limit;

            // Build where condition
            const where = {};
            if (priceCode) {
                where.priceCode = priceCode;
            }
            if (areaCode) {
                where.areaCode = areaCode;
            }
            if (categoryCode) {
                where.categoryCode = categoryCode;
            }

            if (provinceCode) {
                where.provinceCode = provinceCode;
            }

            const { count, rows } = await Post.findAndCountAll({
                where,
                limit,
                offset,
                order: [["createdAt", "DESC"]],
                include: [
                    { model: Image, as: "images", attributes: ["image"] },
                    {
                        model: User,
                        as: "user",
                        attributes: {
                            exclude: [
                                "password",
                                "email_verified",
                                "email_verified_at",
                            ],
                        },
                    },
                    {
                        model: Attribute,
                        as: "attributes",
                        attributes: [
                            "price",
                            "acreage",
                            "published",
                            "hashtag",
                        ],
                    },
                ],
            });

            return {
                data: rows,
                pagination: {
                    totalPages: Math.ceil(count / limit),
                    currentPage: parseInt(page),
                    limit: parseInt(limit),
                    totalItems: count,
                },
            };
        } catch (error) {
            throw error;
        }
    }

    async getNewPosts(limit = 10) {
        try {
            const response = await Post.findAll({
                raw: true,
                nest: true,
                limit,
                order: [["createdAt", "DESC"]],
                include: [
                    { model: Image, as: "images", attributes: ["image"] },
                    {
                        model: Attribute,
                        as: "attributes",
                        attributes: [
                            "price",
                            "acreage",
                            "published",
                            "hashtag",
                        ],
                    },
                ],
            });

            if (!response.length) {
                const error = new Error("Không tìm thấy bài viết mới nào");
                error.statusCode = 404;
                throw error;
            }

            return response;
        } catch (error) {
            throw error;
        }
    }
    async createNewPost(body, userId) {
        try {
            const {
                categoryCode,
                title,
                priceNumber,
                areaNumber,
                images,
                address,
                priceCode,
                areaCode,
                description,
                target,
                province,
                label,
                ...otherFields
            } = body;

            const labelCode = generateCode(label);

            const hashtag = Math.floor(Math.random() * Math.pow(10, 6));

            //Tao Attribute trước
            const attribute = await Attribute.create({
                // price: `${+ priceNumber} triệu/tháng`,
                price:
                    +priceNumber < 1
                        ? `${+priceNumber * 1000000} đồng/tháng`
                        : `${priceNumber} triệu/tháng`,
                acreage: `${areaNumber}m²`,
                published: moment(new Date()).format("DD/MM/YYYY"),
                hashtag: `${hashtag}`,
            });

            //Tạo images
            const image = await Image.create({
                image: JSON.stringify(images),
            });

            //Tạo overview

            // Xác định type và area description dựa trên categoryCode
            let overviewType = "Cho thuê phòng trọ"; // Mặc định

            switch (categoryCode) {
                case "CTCH":
                    overviewType = "Cho thuê căn hộ";
                    break;
                case "CTMB":
                    overviewType = "Cho thuê mặt bằng";
                    break;
                case "NCT":
                    overviewType = "Nhà cho thuê";
                    break;
                case "CTPT":
                default:
                    overviewType = "Cho thuê phòng trọ";
                    break;
            }

            const overview = await Overview.create({
                code: `#${hashtag}`,
                area: label,
                type: overviewType,
                target: target || "Tất cả",
                bonus: "Tin thường",
                created: generateDate(),
                expired: generateDate(30), //Hết hạn
            });

            const response = await Post.create({
                title: title || null,
                star: "0", // Mặc định 0 sao
                labelCode: labelCode,
                address,
                attributesId: attribute.id,
                priceCode,
                areaCode,
                categoryCode,
                description: JSON.stringify(description),
                userId,
                overviewId: overview.id,
                imagesId: image.id,
                provinceCode: body?.province?.includes("Thành phố")
                    ? generateCode(body?.province?.replace("Thành phố ", ""))
                    : generateCode(body?.province.replace("Tỉnh ", "")),
                priceNumber: parseFloat(priceNumber) || 0,
                areaNumber: parseFloat(areaNumber) || 0,
            });

            await Province.findOrCreate({
                where: {
                    [Op.or]: [
                        { value: body?.province?.replace("Thành phố ", "") },
                        { value: body?.province?.replace("Tỉnh ", "") },
                    ],
                },
                defaults: {
                    code: body?.province?.includes("Thành phố")
                        ? generateCode(
                              body?.province?.replace("Thành phố ", "")
                          )
                        : generateCode(body?.province.replace("Tỉnh ", "")),
                    value: body?.province?.includes("Thành phố")
                        ? body?.province?.replace("Thành phố ", "")
                        : body?.province?.replace("Tỉnh ", ""),
                },
            });

            await Label.findOrCreate({
                where: {
                    code: labelCode,
                },
                defaults: {
                    code: labelCode,
                    value: body.label,
                },
            });

            const result = await Post.findOne({
                where: { id: response.id },
                include: [
                    { model: Image, as: "images", attributes: ["id", "image"] },
                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "name", "phone", "avatar"],
                    },
                    { model: Attribute, as: "attributes" },
                    { model: Overview, as: "overview" },
                ],
            });

            return result;
        } catch (error) {
            console.error("Error creating post service:", error);
            throw error;
        }
    }
}

const postService = new PostService();
module.exports = postService;
