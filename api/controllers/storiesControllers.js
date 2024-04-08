const HttpError = require("../models/errorMerrorModel");
const Story = require("../models/Story");
const User = require("../models/User");

module.exports.createStory = async (req, res, next) => {
  const { userId } = req.params;
  const { text } = req;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new HttpError("No user found", 404);
    }
    let image = "";

    if (req.file) {
      image = process.env.URL + `/uploads/${req.file.filename}`; //generate imageURL
    }

    const newStory = new Story({
      user: userId,
      image,
      text,
    });

    await newStory.save();
    res.status(200).json(newStory);
  } catch (error) {
    next(error);
  }
};

module.exports.getStories = async (req, res, next) => {
  const { userId } = req;
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new HttpError("No user found", 404);
    }

    const followingUsers = user.following;
    const stories = await Story.find({
      user: { $in: followingUsers },
    }).populate("user", "fullName username profilePicture");

    res.status(200).json(stories);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserStories = async (req, res, next) => {
  const userId = req;
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new HttpError("No user found", 404);
    }

    const stories = await Story.find({ user: userId }).populate(
      "user",
      "fullName username profilePicture"
    );

    res.status(200).json(stories);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteStory = async (req, res) => {
  const storyId = req.params.storyId;
  try {
    await Story.findByIdAndDelete(storyId);
    res.status(200).json({ message: "Story has been deleted!" });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteStories = async (req, res, next) => {
  const userId = req;
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new HttpError("No user found", 404);
    }
    await Story.deleteMany({ user: userId });
    res.status(200).json({ message: "Stories has been deleted!" });
  } catch (error) {
    next(error);
  }
};
