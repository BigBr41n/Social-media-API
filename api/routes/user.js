const router=require("express").Router(); 
const {getUser , updateUser ,followUser , unfollowUser ,blockUser ,unBlockUser , getBlockedUsers , deleteUser ,uploadProfilePicture , uploadCoverPicture , searchUser } = require('../controllers/userController'); 
const upload = require('../middlewares/upload'); 
const verifyToken = require('../middlewares/verifyToken'); 


//GET USER
router.get("/:userId",getUser); 

//UPDATE USER
//POROTECTED ROUTE
router.put("/update/:userId", verifyToken ,updateUser); 

//FOLLOW USER
//PROTECTED ROUTE
router.post("/follow/:userId", verifyToken ,followUser); 


//UNFOLLOW USER
//POROTECTED ROUTE
router.post("/unfollow/:userId", verifyToken ,unfollowUser); 


//BLOCK USER
//POROTECTED ROUTE
router.post("/block/:userId", verifyToken ,blockUser);

//UNBLOCK USER
//POROTECTED ROUTE
router.post("/unblock/:userId", verifyToken ,unBlockUser);

//GET BLOCKED USERS
//POROTECTED ROUTE
router.get("/blocked/:userId", verifyToken ,getBlockedUsers);



//DELETE USER
//POROTECTED ROUTE
router.delete("/delete/:userId", verifyToken ,deleteUser); 


//SEARCH USER
router.get("/search/:query",searchUser)


//UPDATE PROFILE PICTURE
//POROTECTED ROUTE
router.put("/update-profile-picture/:userId", verifyToken , upload.single("profilePicture"), uploadProfilePicture); 

//UPDATE PROFILE PICTURE
//POROTECTED ROUTE
router.put("/update-cover-picture/:userId", verifyToken ,upload.single("coverPicture"),uploadCoverPicture); 

module.exports=router ; 