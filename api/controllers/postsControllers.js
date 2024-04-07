const Post = require("../models/Post");
const User = require("../models/User");
const HttpError = require("../models/errorModel");

//======== POST
//======== /api/posts/create
//======== PROTECTED
//======== TESTED
module.exports.createPost = async (req, res, next) => {
  const { userId } = req; //sent by jwt (the logedIn User);
  const { caption } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new HttpError("User not found!", 404);
    }

    //creating the post after finding the user
    const newPost = new Post({
      user: userId,
      caption,
    });

    await newPost.save();
    //pushing the id of the post to the creator array of posts id as a ref
    user.posts.push(newPost._id);
    await user.save();
    res
      .status(201)
      .json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    next(error);
  }
};

//function to generate fileUrl for the pictures
const generateFileUrl = (filename) => {
  return process.env.URL + `/uploads/${filename}`;
};

//======== POST
//======== /api/posts/create-images
//======== PROTECTED
//======== TESTED
module.exports.createPostWithImages = async (req, res, next) => {
  const { userId } = req; //jwt
  const { caption } = req.body;
  const files = req.files;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new HttpError("User not found!", 404);
    }

    //for each image we generate a fileUrl
    const imageUrls = files.map((file) => generateFileUrl(file.filename));
    const newPost = new Post({
      user: userId,
      caption,
      image: imageUrls,
    });

    await newPost.save();
    //ref to user
    user.posts.push(newPost._id);
    await user.save();
    res
      .status(201)
      .json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    next(error);
  }
};

//======== PUT
//======== /api/posts/update/:postId
//======== PROTECTED
//======== TESTED
module.exports.updatePost = async (req, res, next) => {
  const { postId } = req.params; //grab the post
  const { caption } = req.body; // grab the caption
  try {
    const postToUpdate = await Post.findById(postId);
    if (!postToUpdate) {
      throw new HttpError("Post not found!", 404);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { caption },
      { new: true }
    );

    // await postToUpdate.save()
    res
      .status(200)
      .json({ message: "Post updated successfully!", post: updatedPost });
  } catch (error) {
    next(error);
  }
};

//======== GET
//======== /api/posts/all/:userId
//======== UNPROTECTED
//======== TESTED
module.exports.getPosts = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new HttpError("User not found!", 404);
    }

    const blockedUserIds = user.blockList.map((id) => id.toString());

    const allPosts = await Post.find({
      user: { $nin: blockedUserIds },
    }).populate("user", "username fullName profilePicture");
    res.status(200).json({ posts: allPosts });
  } catch (error) {
    next(error);
  }
};

//======== DELETE
//======== /api/posts/delete/:postId
//======== PROTECTED
//======== TESTED
module.exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const postToDelete = await Post.findById(postId);
    if (!postToDelete) {
      throw new HttpError("Post not found!", 404);
    }
    const user = await User.findById(postToDelete.user);
    if (!user) {
      throw new HttpError("User not found!", 404);
    }
    if (user._id != req.userId) {
      throw new HttpError("You are not authorized to delete this post!", 401);
    }
    user.posts = user.posts.filter(
      (postId) => postId.toString() !== postToDelete._id.toString()
    ); //remove the post from the users list in the database
    await user.save();
    await postToDelete.deleteOne();
    await Comment.deleteMany({ post: postId });

    res.status(200).json({ message: "Post deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

//======== POST
//======== /api/posts/like/:postId
//======== PROTECTED
//======== TESTED
module.exports.likePost = async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new HttpError("Post not found!", 404);
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new HttpError("User not found!", 404);
    }
    if (post.likes.includes(userId)) {
      throw new HttpError("You have already liked this post!", 404);
    }
    post.likes.push(userId);
    await post.save();
    res.status(200).json({ message: "Post liked successfully!", post });
  } catch (error) {
    next(error);
  }
};

//======== POST
//======== /api/posts/dislike/:postId
//======== PROTECTED
//======== TESTED
module.exports.dislikePost = async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new HttpError("Post not found!", 404);
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new HttpError("User not found!", 404);
    }
    if (user._id != userId) {
      throw new HttpError("You are not authorized to dislike this post!", 401);
    }
    if (!post.likes.includes(userId)) {
      throw new HttpError("You have not liked the post!", 404);
    }

    post.likes = post.likes.filter((id) => id.toString() !== userId);
    await post.save();
    res.status(200).json({ message: "Post disliked successfully!", post });
  } catch (error) {
    next(error);
  }
};
