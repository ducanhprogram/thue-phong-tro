const { Post, Image, Attribute, User } = require("@/models");

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

    async getPostsLimit(page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const { count, rows } = await Post.findAndCountAll({
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
}

const postService = new PostService();
module.exports = postService;
