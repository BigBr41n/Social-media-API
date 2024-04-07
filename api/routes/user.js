const router = require("express").Router();
const {
  getUser,
  updateUser,
  followUser,
  unfollowUser,
  blockUser,
  unBlockUser,
  getBlockedUsers,
  deleteUser,
  uploadProfilePicture,
  uploadCoverPicture,
  searchUser,
} = require("../controllers/userController");
const upload = require("../middlewares/upload");
const verifyToken = require("../middlewares/verifyToken");

//GET USER
router.get("/:userId", getUser);

//UPDATE USER
//PROTECTED ROUTE
router.put("/update/:userId", verifyToken, updateUser);

//FOLLOW USER
//PROTECTED ROUTE
router.post("/follow/:userId", verifyToken, followUser);

//UNFOLLOW USER
//PROTECTED ROUTE
router.post("/unfollow/:userId", verifyToken, unfollowUser);

//BLOCK USER
//PROTECTED ROUTE
router.post("/block/:userId", verifyToken, blockUser);

//UNBLOCK USER
//PROTECTED ROUTE
router.post("/unblock/:userId", verifyToken, unBlockUser);

//GET BLOCKED USERS
//PROTECTED ROUTE
router.get("/blocked/:userId", verifyToken, getBlockedUsers);

//DELETE USER
//PROTECTED ROUTE
router.delete("/delete/:userId", verifyToken, deleteUser);

//SEARCH USER
router.get("/search/:query", searchUser);

//UPDATE PROFILE PICTURE
//PROTECTED ROUTE
router.put(
  "/update-profile-picture",
  verifyToken,
  upload.single("profilePicture"),
  uploadProfilePicture
);

//UPDATE PROFILE PICTURE
//PROTECTED ROUTE
router.put(
  "/update-cover-picture",
  verifyToken,
  upload.single("coverPicture"),
  uploadCoverPicture
);

module.exports = router;
