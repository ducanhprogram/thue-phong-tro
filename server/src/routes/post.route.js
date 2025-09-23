const express = require("express");
const router = express.Router();
const postController = require("@/controllers/post.controller");
const checkAuth = require("@/middlewares/checkAuth");

router.get("/", postController.getPosts);
router.get("/limit", postController.getPostsLimit);
router.get("/new-post", postController.getNewPosts);

router.get("/limit-admin", checkAuth, postController.getPostsLimitAdmin);
router.get("/:id", postController.getPostById); // Lấy chi tiết bài viết
router.get("/:id/related", postController.getRelatedPosts); // Lấy bài viết liên quan
router.post("/create-new-post", checkAuth, postController.createNewPost);

router.put("/update/:id", checkAuth, postController.updatePost);
router.delete("/delete/:id", checkAuth, postController.deletePost);

module.exports = router;
