const Chat = require("../models/Chat");
const ChatState = require("../models/ChatState");
const User = require("../models/User");

exports.getUsers = async (req, res, next) => {
  try {
    let users = [];
    const chats = await Chat.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }],
    });
    const usersIdArray = [
      ...chats.map((chat) => chat.sender),
      ...chats.map((chat) => chat.recipient),
    ].filter((value, index, self) => {
      return (
        self.map((item) => item.toString()).indexOf(value.toString()) ===
          index && value.toString() !== req.user._id.toString()
      );
    });
    for (each of usersIdArray) {
      let result = await _getUserById(each);
      if (result.success) users.push(result.user);
    }
    res.send({ users });
  } catch (error) {
    next(error);
  }
};

exports.searchUsers = async (req, res, next) => {
  try {
    let users = [];
    const usersIdArray = await User.find({
      $or: [
        {
          username: { $regex: req.body.keyword, $options: "i" },
          email: { $regex: req.body.keyword, $options: "i" },
        },
      ],
    }).select("_id");
    for (each of usersIdArray) {
      let result = await _getUserById(each);
      if (result.success) users.push(result.user);
    }
    res.send({ users });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  const result = await _getUserById(req.params.id);
  if (result.success) {
    res.send({ user: result.user });
  } else {
    next(result.error);
  }
};

const _getUserById = async (id) => {
  try {
    let user = await ChatState.findOne({ user: id })
      .populate({
        path: "user",
        model: "user",
        populate: {
          path: "profile",
          model: "profile",
        },
      })
      .exec();
    if (!user) {
      user = await User.findById(id).populate("profile");
      await ChatState.create({
        user: user._id,
        lastSeen: [],
      });
    }
    return {
      success: true,
      user,
    };
  } catch (error) {
    return { success: false, error };
  }
};

exports.getChatsByUserId = async (req, res, next) => {
  try {
    const sender = req.user._id;
    const recipient = req.body.recipient;
    const chats = await Chat.find({
      $or: [
        { sender, recipient },
        { sender: recipient, recipient: sender },
      ],
    });
    res.send({ chats });
  } catch (error) {
    next(error);
  }
};

exports.createChat = async (req, res, next) => {
  try {
    const chat = await Chat.create({
      sender: req.body.sender,
      recipient: req.body.recipient,
      text: req.body.text,
    });
    res.send({ chat });
  } catch (error) {
    next(error);
  }
};

exports.getState = async (req, res, next) => {
  try {
    let chatState = await ChatState.findOne({ user: req.user._id });
    if (chatState && chatState.state) {
      res.send({ state: chatState.state });
    } else {
      await ChatState.create({
        user: req.user._id,
        lastSeen: [],
      });
      res.send({ state: "Online" });
    }
  } catch (error) {
    next(error);
  }
};

exports.setState = async (req, res, next) => {
  try {
    let chatState = await ChatState.findOne({ user: req.user._id });
    if (chatState) {
      chatState.state = req.body.state;
      await chatState.save();
      res.send({ state: chatState.state });
    } else {
      await ChatState.create({
        user: req.user._id,
        state: req.body.state,
        lastSeen: [],
      });
      res.send({ state: req.body.state });
    }
  } catch (error) {
    next(error);
  }
};
