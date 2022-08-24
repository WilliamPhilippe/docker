const express = require("express");

const {
  createPost,
  deletePost,
  getAllPosts,
  getOnePost,
  updatePost,
} = require("../controllers/postController");

const router = express.Router();

router.route("/").get(getAllPosts).post(createPost);
router.route("/:id").get(getOnePost).patch(updatePost).delete(deletePost);

module.exports = router;
