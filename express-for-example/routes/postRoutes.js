const express = require("express");

const {
  createPost,
  deletePost,
  getAllPosts,
  getOnePost,
  updatePost,
} = require("../controllers/postController");
const { protectMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(protectMiddleware, getAllPosts)
  .post(protectMiddleware, createPost);
router
  .route("/:id")
  .get(protectMiddleware, getOnePost)
  .patch(protectMiddleware, updatePost)
  .delete(protectMiddleware, deletePost);

module.exports = router;
