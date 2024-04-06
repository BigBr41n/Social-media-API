const HttpError = require("../models/errorModel"); 
const User=require("../models/User");
const Post=require("../models/Post");
const Comment=require("../models/Comment");
const Story=require("../models/Story");
require('dotenv').config(); 




//======= GET 
//======= /api/v1/users/:id 
//======= UNPOROTECTED 
//======= TESTED USING POSTMAN
module.exports.getUser=async(req,res,next)=>{
    const {userId}=req.params
    try{
        const user=await User.findById(userId).select("-password");
        if(!user){
            throw new HttpError("No user found",404)
        }

        res.status(200).json(user._doc)

    }
    catch(error){
        next(error)
    }

}; 


//======= PUT
//======= /api/v1/users/:id 
//======= POROTECTED 
//======= TESTED USING POSTMAN
module.exports.updateUser=async (req,res,next)=>{

    const {userId}=req.params
    const updateData=req.body

    try{

        const userToUpdate=await User.findById(userId); 
        if(!userToUpdate){
            throw new HttpError("User not found!",404); 
        }

        Object.assign(userToUpdate,updateData)

        await userToUpdate.save()


        //for security reasons , remove the password from the returned data
        const {password , ...data} = userToUpdate._doc; 
        res.status(200).json({message:"User updated successfully!",user:data}); 

    }
    catch(error){
        next(error)
    }
}; 





//======= POST
//======= /api/v1/users/follow/:userId
//======= POROTECTED 
//======= TESTED USING POSTMAN
module.exports.followUser=async(req,res,next)=>{

    const {userId}=req.params
    const {_id}=req.body

    try{
        if(userId===_id){
            throw new HttpError("You can not follow yourself",400); 
        }

        const userToFollow=await User.findById(userId);
        const loggedInUser=await User.findById(_id); 


        if(!userToFollow || !loggedInUser){
            throw new HttpError("User not found!",404); 
        }

        if(loggedInUser.following.includes(userId)){
            throw new HttpError("Already following this user!",400); 
        }

        loggedInUser.following.push(userId); 
        userToFollow.followers.push(_id); 

        await loggedInUser.save()
        await userToFollow.save()

        res.status(200).json({message:"Successfully followed user!"})

    }
    catch(error){
        console.log(error); 
        next(error)
    }
}; 



//======= POST
//======= /api/v1/users/unfollow/:userId
//======= POROTECTED 
//======= TESTED USING POSTMAN
module.exports.unfollowUser = async(req,res,next)=>{
    const {userId}=req.params
    const {_id}=req.body

    try{
        if(userId===_id){
            throw new HttpError("You can not unfollow yourself",500)
        }

        const userToUnfollow=await User.findById(userId);
        const loggedInUser=await User.findById(_id);

      

        if(!userToUnfollow || !loggedInUser){
            throw new HttpError("User not found!",404)
        }

        if(!loggedInUser.following.includes(userId)){
            throw new HttpError("Not following this user",400); 
        }

        //remove the followed user from the array 
        loggedInUser.following=loggedInUser.following.filter(id=>id.toString()!==userId); 
        userToUnfollow.followers=userToUnfollow.followers.filter(id=>id.toString()!==_id);

        await loggedInUser.save(); 
        await userToUnfollow.save(); 

        res.status(200).json({message:"Successfully unfollowed user!"}); 

    }
    catch(error){
        next(error)
    }
}; 










//======= POST
//======= /api/v1/users/block/:userId
//======= POROTECTED 
//======= TESTED USING POSTMAN
module.exports.blockUser = async (req,res,next)=>{
    const {userId}=req.params
    const {_id}=req.body
    try{
        if(userId===_id){
            throw new HttpError("You can not block yourself",400); 
        }

        const userToBlock=await User.findById(userId); 
        const loggedInUser=await User.findById(_id); 

        if(!userToBlock || !loggedInUser){
            throw new HttpError("User not found!",404); 
        }

        if(loggedInUser.blockList.includes(userId)){
            throw new HttpError("This user is already blocked!",400); 
        }

        loggedInUser.blockList.push(userId); 


        //if the user blocked he will be out of following and  follwers
        loggedInUser.following=loggedInUser.following.filter(id=>id.toString()!==userId); 
        userToBlock.followers=userToBlock.followers.filter(id=>id.toString()!==_id); 

        await loggedInUser.save(); 
        await userToBlock.save(); 

        res.status(200).json({message:"Successfully blocked user!"}); 

    }
    catch(error){
        next(error); 
    }
}






//======= POST
//======= /api/v1/users/unblock/:userId
//======= POROTECTED 
//======= TESTED USING POSTMAN
module.exports.unBlockUser = async(req,res,next)=>{
    const {userId}=req.params ; 
    const {_id}=req.body ; 
    try{
        if(userId===_id){
            throw new HttpError("You can not unblock yourself",400); 
        }

        const userToUnblock=await User.findById(userId); 
        const loggedInUser=await User.findById(_id); 


        if(!userToUnblock || !loggedInUser){
            throw new HttpError("User not found!",404); 
        }


        loggedInUser.blockList=loggedInUser.blockList.filter(id=>id.toString()!=userId); 

        await loggedInUser.save(); 
        
        res.status(200).json({message:"Successfully unblocked user!"}); 

    }
    catch(error){
        next(error); 
    }
}








//======= GET
//======= /api/v1/users/blocked/:userId
//======= POROTECTED 
//======= TESTED USING POSTMAN
module.exports.getBlockedUsers = async(req,res,next)=>{
    const {userId}=req.params ; 
    try{
        const user=await User.findById(userId).populate("blockList","username fullName profilePicture"); 
        if(!user){
            throw new HttpError("User not found!",404); 
        }

        const {blockList,...data}=user._doc ; 

        res.status(200).json(blockList); 

    }
    catch(error){
        next(error); 
    }
} ;






//======= DELETE
//======= /api/v1/users/delete/:userId
//======= POROTECTED 
//======= TESTED USING POSTMAN
module.exports.deleteUser = async(req,res,next)=>{
    const {userId}=req.params ; 

    try{

        const userToDelete=await User.findById(userId); 

        if(!userToDelete){
            throw new HttpError("User not found!",404); 
        }


        //deelete any related things with this user from database 
        await Post.deleteMany({user:userId}); 
        await Post.deleteMany({"comments.user":userId}); 
        await Post.deleteMany({"comments.replies.user":userId}); 
        await Comment.deleteMany({user:userId}); 
        await Story.deleteMany({user:userId}); 
        await Post.updateMany({likes:userId},{$pull:{likes:userId}}); 
        await User.updateMany(
            {_id:{$in:userToDelete.following}},
            {$pull:{followers:userId}});
        await Comment.updateMany({},{$pull:{likes:userId}}); 
        await Comment.updateMany({"replies.likes":userId},{$pull:{"replies.likes":userId}}); 
        await Post.updateMany({},{$pull:{likes:userId}}); 

        const replyComments=await Comment.find({"replies.user":userId});


        //delete this user replies and avoid to delete other replies 
        await Promise.all(
            replyComments.map(async(comment)=>{
                comment.replies=comment.replies.filter((reply)=>reply.user.toString()!=userId)
                await Comment.save()
            })
        )

        //deleting the user 
        await userToDelete.deleteOne()
        res.status(200).json({message:"Everything associated with user is deleted successfully!"})

    }
    catch(error){
        next(error)
    }
}; 














//function to generate a file Url for a pic
const generateFileUrl=(filename)=>{
    return process.env.URL+`/uploads/${filename}`
}



//======= PUT
//======= /api/v1/users/update-profile-picture/:userId
//======= POROTECTED 
//======= TESTED USING POSTMAN
module.exports.uploadProfilePicture = async(req,res,next)=>{
    const {userId}=req.params ; 
    const {filename}=req.file ; 
    try{
        const user=await User.findByIdAndUpdate(userId,{profilePicture:generateFileUrl(filename)},{new:true});
        if(!user){
            throw new HttpError("User not found!",404); 
        }

        res.status(200).json({message:"Profile picture updated successfully!",user}); 

    }
    catch(error){
        next(error); 
    }
}






//======= PUT
//======= /api/v1/users/update-cover-picture/:userId
//======= POROTECTED 
//======= TESTED USING POSTMAN
module.exports.uploadCoverPicture = async(req,res,next)=>{
    const {userId}=req.params ; 
    const {filename}=req.file ; 
    try{
        const user=await User.findByIdAndUpdate(userId,{coverPicture:generateFileUrl(filename)},{new:true}); 
        if(!user){
            throw new CustomError("User not found!",404); 
        }

        res.status(200).json({message:"Cover picture updated successfully!",user}); 

    }
    catch(error){
        next(error); 
    }
}







//======= GET
//======= /api/v1/users/search/:query/:query
//======= POROTECTED 
//======= TESTED USING POSTMAN
module.exports.searchUser = async (req,res,next)=>{
    const {query}=req.params ;
    try{

        //search about the user in the db
        const users=await User.find({
            $or:[
                {username:{$regex:new RegExp(query,'i')}},
                {fullName:{$regex:new RegExp(query,'i')}}
            ]
        })


        // Filter out the password from each user object
        const usersWithoutPassword = users.map(user => {
            const { password, ...userWithoutPassword } = user.toObject(); // Convert Mongoose document to plain JavaScript object
            return userWithoutPassword;
        });
        res.status(200).json({users : usersWithoutPassword}) ; 
    }
    catch(error){
        next(error); 
    }

}









