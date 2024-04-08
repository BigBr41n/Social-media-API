const router = require("express").Router();
const {
  createMessage,
  getMessages,
  deleteMessage,
} = require("../controllers/messagesControllers");

const verifyToken = require("../middlewares/verifyToken");

//CREATE MESSAGE
router.post("/create", verifyToken, createMessage);

//GET MESSAGES
router.get("/:conversationId", verifyToken, getMessages);

//DELETE MESSAGE
router.delete("/:messageId", verifyToken, deleteMessage);

module.exports = router;
