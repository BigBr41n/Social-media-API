const router = require("express").Router();
const {
  createNewConversation,
  getConversationOfUser,
  getTwoUsersConversation,
  deleteConversation,
} = require("../controllers/conversationsControllers");
const verifyToken = require("../middlewares/verifyToken");

//NEW CONVERSATION
router.post("/create", verifyToken, createNewConversation);

//GET CONVERSATIONS OF USER
router.get("/:userId", verifyToken, getConversationOfUser);

//FIND TWO USERS CONVERSATION
router.get("/:firstUserId/:secondUserId", verifyToken, getTwoUsersConversation);

//DELETE CONVERSATION
router.delete("/delete/:conversationId", verifyToken, deleteConversation);

module.exports = router;
