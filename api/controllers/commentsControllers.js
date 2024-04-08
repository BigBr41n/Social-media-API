const HttpError = require("../models/errorModel");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

//========= POST
//========= /api/v1/comments/create
//========= PROTECTED
module.exports.createComment = async (req, res, next) => {
  const { postId, text } = req.body;
  const { userId } = req; // jwt verify middleware
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new HttpError("Post not found", 404);
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new HttpError("User not found!", 404);
    }

    const newComment = new Comment({
      user: userId,
      post: postId,
      text,
    });

    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();

    res
      .status(201)
      .json({ message: "Comment added to the post", comment: newComment });
  } catch (error) {
    next(error);
  }
};

//========= POST
//========= /api/v1/comments/reply/:commentId
//========= PROTECTED
module.exports.createCommentReply = async (req, res, next) => {
  const { commentId } = req.params;
  const { text } = req.body;
  const { userId } = req;
  try {
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      throw new HttpError("Parent comment not found!", 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new HttpError("User not found!", 404);
    }

    const reply = {
      text,
      user: userId,
    };

    parentComment.replies.push(reply);
    await parentComment.save();
    res.status(201).json({ message: "Reply created successfully!", reply });
  } catch (error) {
    next(error);
  }
};

//========= POST
//========= /api/v1/comments/update/:commentId
//========= PROTECTED
module.exports.updateComment = async (req, res, next) => {
  const { commentId } = req.params;
  const { text } = req.body;

  try {
    const commentToUpdate = await Comment.findById(commentId);
    if (!commentToUpdate) {
      throw new HttpError("Comment not found!", 404);
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { text },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Comment updated successfully!", updatedComment });
  } catch (error) {
    next(error);
  }
};

//========= POST
//========= /api/v1/comments/update/:commentId/replies/:replayId
//========= PROTECTED
module.exports.updateReplyComment = async (req, res, next) => {
  const { commentId, replyId } = req.params;
  const { text } = req.body;
  const { userId } = req;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new HttpError("Comment not found!", 404);
    }

    const replyIndex = comment.replies.findIndex(
      (reply) => reply._id.toString() === replyId
    );
    if (replyIndex === -1) {
      throw new HttpError("Reply not found!", 404);
    }

    if (comment.replies[replyIndex].user.toString() !== userId) {
      throw new HttpError("You can only update your comments", 404);
    }

    comment.replies[replyIndex].text = text;

    await comment.save();
    res.status(200).json({ message: "Reply updated successfully!", comment });
  } catch (error) {
    next(error);
  }
};

const populateUserDetails = async (comments) => {
  for (const comment of comments) {
    await comment.populate("user", "username fullName profilePicture");
    if (comment.replies.length > 0) {
      await comment.populate(
        "replies.user",
        "username fullName profilePicture"
      );
    }
  }
};

//========= POST
//========= /api/v1/comments/post/:postId
//========= UNPROTECTED
module.exports.getCommentsByPost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new HttpError("Post not found!", 404);
    }

    let comments = await Comment.find({ post: postId });

    await populateUserDetails(comments);

    res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
};

//========= POST
//========= /api/v1/comments/delete/:commentId
//========= PROTECTED

module.exports.deleteComment = async (req, res, next) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new HttpError("Comment not found!", 404);
    }

    await Post.findOneAndUpdate(
      { comments: commentId },
      { $pull: { comments: commentId } },
      { new: true }
    );

    await comment.deleteOne();
    res.status(200).json({ message: "Comment has been deleted!" });
  } catch (error) {
    next(error);
  }
};

//========= POST
//========= /api/v1/comments/update/:commentId/replies/:replyId
//========= PROTECTED
module.exports.deleteReplyComment = async (req, res, next) => {
  const { commentId, replyId } = req.params;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new HttpError("Comment not found!", 404);
    }

    comment.replies = comment.replies.filter((id) => {
      id.toString() !== replyId;
    });

    await comment.save();
    res.status(200).json({ message: "Reply comment deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

//========= POST
//========= /api/v1/comments/like/:commentId
//========= PROTECTED
module.exports.likeComment = async (req, res, next) => {
  const { commentId } = req.params;
  const { userId } = req;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new HttpError("Comment not found!", 404);
    }

    if (comment.likes.includes(userId)) {
      throw new HttpError("You have already liked this comment", 400);
    }

    comment.likes.push(userId);
    await comment.save();

    res.status(200).json({ message: "Comment liked successfully!", comment });
  } catch (error) {
    next(error);
  }
};

//========= POST
//========= /api/v1/comments/dislike/:commentId
//========= PROTECTED

module.exports.dislikeComment = async (req, res, next) => {
  const { commentId } = req.params;
  const { userId } = req;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new HttpError("Comment not found!", 404);
    }

    if (!comment.likes.includes(userId)) {
      throw new HttpError("You have not liked this comment", 400);
    }

    comment.likes = comment.likes.filter((id) => id.toString() !== userId);
    await comment.save();

    res
      .status(200)
      .json({ message: "Comment disliked successfully!", comment });
  } catch (error) {
    next(error);
  }
};

//========= POST
//========= /api/v1/comments/like/:commentId/replies/:replyId
//========= PROTECTED

module.exports.likeReplyComment = async (req, res, next) => {
  const { commentId, replyId } = req.params;
  const { userId } = req;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new HttpError("Comment not found!", 404);
    }

    const replyComment = comment.replies.id(replyId);
    if (!replyComment) {
      throw new HttpError("Reply comment not found!", 404);
    }

    if (replyComment.likes.includes(userId)) {
      throw new HttpError("You already liked the reply comment!", 400);
    }
    replyComment.likes.push(userId);
    await comment.save();
    res
      .status(200)
      .json({ message: "Reply comment liked successfully!", comment });
  } catch (error) {
    next(error);
  }
};

//========= POST
//========= /api/v1/comments/dislike/:commentId/replies/:replyId
//========= PROTECTED
module.exports.dislikeReplyComment = async (req, res, next) => {
  const { commentId, replyId } = req.params;
  const { userId } = req;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new HttpError("Comment not found!", 404);
    }

    const replyComment = comment.replies.id(replyId);
    if (!replyComment) {
      throw new HttpError("Reply comment not found!", 404);
    }

    if (!replyComment.likes.includes(userId)) {
      throw new HttpError("You have not liked the reply comment!", 400);
    }
    replyComment.likes = replyComment.likes.filter(
      (id) => id.toString() !== userId
    );
    await comment.save();
    res
      .status(200)
      .json({ message: "Reply comment disliked successfully!", comment });
  } catch (error) {
    next(error);
  }
};
