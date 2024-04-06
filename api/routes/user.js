const router=require("express").Router(); 
const {getUser , updateUser ,followUser , unfollowUser ,blockUser ,unBlockUser , getBlockedUsers , deleteUser } = require('../controllers/userController'); 


//GET USER
router.get("/:userId",getUser); 

//UPDATE USER
router.put("/update/:userId",updateUser); 

//FOLLOW USER
router.post("/follow/:userId",followUser); 


//UNFOLLOW USER
router.post("/unfollow/:userId",unfollowUser); 


//BLOCK USER
router.post("/block/:userId",blockUser);

//UNBLOCK USER
router.post("/unblock/:userId",unBlockUser);

//GET BLOCKED USERS
router.get("/blocked/:userId",getBlockedUsers);



//DELETE USER
router.delete("/delete/:userId",deleteUser); 

/*
//SEARCH USER
router.get("/search/:query",searchUser)

//UPDATE PROFILE PICTURE
router.put("/update-profile-picture/:userId",uploadProfilePicture)

//UPDATE PROFILE PICTURE
router.put("/update-cover-picture/:userId",uploadCoverPicture) */

module.exports=router