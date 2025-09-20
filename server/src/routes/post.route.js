const express = require("express");
const router = express.Router();
const postController = require("@/controllers/post.controller");
const checkAuth = require("@/middlewares/checkAuth");

router.get("/", postController.getPosts);
router.get("/limit", postController.getPostsLimit);
router.get("/new-post", postController.getNewPosts);

router.post("/create-new-post", checkAuth, postController.createNewPost);

module.exports = router;
