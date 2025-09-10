const express = require("express");

const router = express.Router();
const postController = require("@/controllers/post.controller");
router.get("/", postController.getPosts);
router.get("/limit", postController.getPostsLimit);
router.get("/new-post", postController.getNewPosts);

module.exports = router;
