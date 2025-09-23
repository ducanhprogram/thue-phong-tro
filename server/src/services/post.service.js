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
    async getPostById(postId) {
        try {
            const response = await Post.findOne({
                where: { id: postId },
                include: [
                    {
                        model: Image,
                        as: "images",
                        attributes: ["image"],
                    },
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
                    {
                        model: Overview,
                        as: "overviews",
                    },
                ],
            });

            if (!response) {
                const error = new Error("Không tìm thấy bài viết");
                error.statusCode = 404;
                throw error;
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    // Thêm method getRelatedPosts để lấy bài viết liên quan
    async getRelatedPosts(postId, categoryCode, provinceCode, limit = 5) {
        try {
            const where = {
                id: { [Op.ne]: postId }, // Loại trừ bài viết hiện tại
            };

            // Tìm bài viết cùng danh mục trước
            if (categoryCode) {
                where.categoryCode = categoryCode;
            }

            // Nếu có provinceCode thì ưu tiên bài viết cùng tỉnh
            if (provinceCode) {
                where.provinceCode = provinceCode;
            }

            let relatedPosts = await Post.findAll({
                where,
                limit,
                order: [["createdAt", "DESC"]],
                include: [
                    { model: Image, as: "images", attributes: ["image"] },
                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "name", "phone", "avatar"],
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

            // Nếu không đủ bài viết cùng tỉnh, tìm thêm bài viết cùng danh mục
            if (relatedPosts.length < limit && provinceCode) {
                const remainingLimit = limit - relatedPosts.length;
                const additionalPosts = await Post.findAll({
                    where: {
                        id: {
                            [Op.notIn]: [
                                postId,
                                ...relatedPosts.map((p) => p.id),
                            ],
                        },
                        categoryCode,
                    },
                    limit: remainingLimit,
                    order: [["createdAt", "DESC"]],
                    include: [
                        { model: Image, as: "images", attributes: ["image"] },
                        {
                            model: User,
                            as: "user",
                            attributes: ["id", "name", "phone", "avatar"],
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

                relatedPosts = [...relatedPosts, ...additionalPosts];
            }

            return relatedPosts;
        } catch (error) {
            throw error;
        }
    }

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
                    { model: Overview, as: "overviews" },
                ],
            });

            return result;
        } catch (error) {
            console.error("Error creating post service:", error);
            throw error;
        }
    }

    // getPostsLimitAdmin
    async getPostsLimitAdmin(page = 1, limit = 10, id, query) {
        try {
            const offset = (page - 1) * limit;
            const queries = { ...query, userId: id };
            const { count, rows } = await Post.findAndCountAll({
                where: queries,
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
                    { model: Overview, as: "overviews" },
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

    a; // Thêm method này vào class PostService trong file post.service.js hiện tại

    async updatePost(postId, body, userId) {
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

            // Kiểm tra bài viết có tồn tại và thuộc về user không
            const existingPost = await Post.findOne({
                where: { id: postId, userId },
                include: [
                    { model: Attribute, as: "attributes" },
                    { model: Image, as: "images" },
                    { model: Overview, as: "overviews" },
                ],
            });

            if (!existingPost) {
                const error = new Error(
                    "Không tìm thấy bài viết hoặc bạn không có quyền chỉnh sửa"
                );
                error.statusCode = 404;
                throw error;
            }

            const labelCode = generateCode(label);
            const hashtag =
                existingPost.attributes?.hashtag ||
                Math.floor(Math.random() * Math.pow(10, 6));

            // Cập nhật Attribute
            const attributeData = {
                price:
                    +priceNumber < 1
                        ? `${+priceNumber * 1000000} đồng/tháng`
                        : `${priceNumber} triệu/tháng`,
                acreage: `${areaNumber}m²`,
                published: moment(new Date()).format("DD/MM/YYYY"),
                hashtag: `${hashtag}`,
            };

            if (existingPost.attributesId) {
                await Attribute.update(attributeData, {
                    where: { id: existingPost.attributesId },
                });
            } else {
                const attribute = await Attribute.create(attributeData);
                existingPost.attributesId = attribute.id;
            }

            // Cập nhật Image
            const imageData = { image: JSON.stringify(images) };

            if (existingPost.imagesId) {
                await Image.update(imageData, {
                    where: { id: existingPost.imagesId },
                });
            } else {
                const image = await Image.create(imageData);
                existingPost.imagesId = image.id;
            }

            // Xác định type dựa trên categoryCode
            let overviewType = "Cho thuê phòng trọ";
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

            // Cập nhật Overview
            const overviewData = {
                code: `#${hashtag}`,
                area: label,
                type: overviewType,
                target: target || "Tất cả",
                bonus: "Tin thường",
                created: generateDate(),
                expired: generateDate(30),
            };

            if (existingPost.overviewId) {
                await Overview.update(overviewData, {
                    where: { id: existingPost.overviewId },
                });
            } else {
                const overview = await Overview.create(overviewData);
                existingPost.overviewId = overview.id;
            }

            // Cập nhật Post
            const postData = {
                title: title || null,
                labelCode: labelCode,
                address,
                priceCode,
                areaCode,
                categoryCode,
                description: JSON.stringify(description),
                provinceCode: body?.province?.includes("Thành phố")
                    ? generateCode(body?.province?.replace("Thành phố ", ""))
                    : generateCode(body?.province.replace("Tỉnh ", "")),
                priceNumber: parseFloat(priceNumber) || 0,
                areaNumber: parseFloat(areaNumber) || 0,
                attributesId: existingPost.attributesId,
                imagesId: existingPost.imagesId,
                overviewId: existingPost.overviewId,
            };

            await Post.update(postData, {
                where: { id: postId, userId },
            });

            // Cập nhật/tạo Province
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

            // Cập nhật/tạo Label
            await Label.findOrCreate({
                where: {
                    code: labelCode,
                },
                defaults: {
                    code: labelCode,
                    value: body.label,
                },
            });

            // Lấy bài viết đã cập nhật
            const result = await Post.findOne({
                where: { id: postId },
                include: [
                    { model: Image, as: "images", attributes: ["id", "image"] },
                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "name", "phone", "avatar"],
                    },
                    { model: Attribute, as: "attributes" },
                    { model: Overview, as: "overviews" },
                ],
            });

            return result;
        } catch (error) {
            console.error("Error updating post service:", error);
            throw error;
        }
    }

    async deletePost(postId, userId) {
        try {
            // Tìm bài viết cần xóa và kiểm tra quyền sở hữu
            const existingPost = await Post.findOne({
                where: { id: postId, userId },
                include: [
                    { model: Attribute, as: "attributes" },
                    { model: Image, as: "images" },
                    { model: Overview, as: "overviews" },
                ],
            });

            if (!existingPost) {
                const error = new Error(
                    "Không tìm thấy bài viết hoặc bạn không có quyền xóa"
                );
                error.statusCode = 404;
                throw error;
            }

            // Xóa các bảng liên quan trước (để tránh foreign key constraint)

            // Xóa Attribute
            if (existingPost.attributesId) {
                await Attribute.destroy({
                    where: { id: existingPost.attributesId },
                });
            }

            // Xóa Image
            if (existingPost.imagesId) {
                await Image.destroy({
                    where: { id: existingPost.imagesId },
                });
            }

            // Xóa Overview
            if (existingPost.overviewId) {
                await Overview.destroy({
                    where: { id: existingPost.overviewId },
                });
            }

            // Cuối cùng xóa Post
            const deletedCount = await Post.destroy({
                where: { id: postId, userId },
            });

            if (deletedCount === 0) {
                const error = new Error("Không thể xóa bài viết");
                error.statusCode = 500;
                throw error;
            }

            return {
                success: true,
                message: "Xóa bài viết thành công",
                deletedPostId: postId,
            };
        } catch (error) {
            console.error("Error deleting post service:", error);
            throw error;
        }
    }
}

const postService = new PostService();
module.exports = postService;
