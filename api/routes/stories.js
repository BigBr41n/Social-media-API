const router = require("express").Router();
const {
  createStory,
  getStories,
  getUserStories,
  deleteStory,
  deleteStories,
} = require("../controllers/storyController");
const upload = require("../middlewares/upload");
const verifyToken = require("../middlewares/verifyToken");

//CREATE STORY
router.post(
  "/create/:userId",
  verifyToken,
  upload.single("image"),
  createStory
);

//GET ALL STORIES
router.get("/all/:userId", verifyToken, getStories);

//GET USER STORIES
router.get("/user/:userId", verifyToken, getUserStories);

//DELETE A STORY
router.delete("/delete/:storyId", verifyToken, deleteStory);

//DELETE ALL STORIES
router.delete("/delete/stories/:userId", verifyToken, deleteStories);

module.exports = router;
