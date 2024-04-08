const router = require("express").Router();
const {
  createComment,
  createCommentReply,
  updateComment,
  updateReplyComment,
  getCommentsByPost,
  deleteComment,
  deleteReplyComment,
  likeComment,
  dislikeComment,
  likeReplyComment,
  dislikeReplyComment,
} = require("../controllers/commentsControllers");

const verifyToken = require("../middlewares/verifyToken");

//CREATE COMMENT
router.post("/create", verifyToken, createComment);

//CREATE COMMENT REPLY
router.post("/create/reply/:commentId", verifyToken, createCommentReply);

//UPDATE COMMENT
router.put("/update/:commentId", verifyToken, updateComment);

//UPDATE REPLY COMMENT
router.put(
  "/update/:commentId/replies/:replyId",
  verifyToken,
  updateReplyComment
);

//GET ALL POST COMMENTS
router.get("/post/:postId", verifyToken, getCommentsByPost);

//DELETE A COMMENT
router.delete("/delete/:commentId", verifyToken, deleteComment);

//DELETE A REPLY COMMENT
router.delete(
  "/delete/:commentId/replies/:replyId",
  verifyToken,
  deleteReplyComment
);

//LIKE A COMMENT
router.post("/like/:commentId/", verifyToken, likeComment);

//DISLIKE A COMMENT
router.post("/dislike/:commentId/", verifyToken, dislikeComment);

//LIKE A REPLY COMMENT
router.post("/:commentId/replies/like/:replyId", verifyToken, likeReplyComment);

//DISLIKE A REPLY COMMENT
router.post(
  "/:commentId/replies/dislike/:replyId",
  verifyToken,
  dislikeReplyComment
);

module.exports = router;
