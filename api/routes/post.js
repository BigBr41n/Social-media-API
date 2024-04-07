const router = require("express").Router();
const {
  createPost,
  createPostWithImages,
  updatePost,
  getPosts,
  deletePost,
  likePost,
  dislikePost,
} = require("../controllers/postsControllers");
const verifyToken = require("../middlewares/verifyToken");

//CREATE POST
router.post("/create", verifyToken, createPost);

//CREATE POST WITH IMAGES
router.post(
  "/create/:userId",
  verifyToken,
  upload.array("images", 5),
  createPostWithImages
);

//UPDATE POST
router.put("/update/:postId", verifyToken, updatePost);

//GET ALL POSTS
router.get("/all/:userId", getPosts);

//DELETE POST
router.delete("/delete/:postId", verifyToken, deletePost);

//LIKE POST
router.post("/like/:postId", verifyToken, likePost);

//DISLIKE POST
router.post("/dislike/:postId", verifyToken, dislikePost);

module.exports = router;
