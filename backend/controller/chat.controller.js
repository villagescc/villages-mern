const Chat = require("../models/Chat");
const ChatState = require("../models/ChatState");
const SocketRoom = require("../models/SocketRoom");
const User = require("../models/User");


exports.getUsers = async (req, res, next) => {
  try {
    let users = [];
    const chats = await Chat.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }],
    });
    let usersIdArray = [
      ...chats.map((chat) => chat.sender),
      ...chats.map((chat) => chat.recipient),
    ].filter((value, index, self) => {
      return (
        self?.map((item) => item?.toString()).indexOf(value?.toString()) ===
        index && value?.toString() !== req.user._id.toString()
      );
    });
    usersIdArray = usersIdArray.filter(id => id)
    // for (each of usersIdArray) {
    //   let result = await _getUserById(each);
    //   if (result.success) users.push(result.user);
    // }
    let result = await _getUserById(usersIdArray);
    if (result.success) users.push(result.user);
    // temp1.filter((elem,index)=>temp1.findIndex(obj=>obj.user?._id==elem.user?._id)==index).filter(x=>x.user)
    res.send({ users: users?.[0]?.filter((elem, index) => users?.[0]?.findIndex(obj => obj?.user?._id == elem?.user?._id) == index)?.filter(x => x?.user) });
    // res.send({ users: users[0]});
  } catch (error) {
    next(error);
  }
};

exports.searchUsers = async (req, res, next) => {
  try {
    let users = [];
    let usersIdArray = await User.find({
      $or: [
        { username: { $regex: req.body.keyword, $options: "i" } },
        { email: { $regex: req.body.keyword, $options: "i" } },
        { firstName: { $regex: req.body.keyword, $options: "i" } },
        { lastName: { $regex: req.body.keyword, $options: "i" } },
      ],
    }).select("_id");
    // for (each of usersIdArray) {
    //   let result = await _getUserById(each);
    //   if (result.success) users.push(result.user);
    // }
    usersIdArray = usersIdArray.filter(id => id)
    // for (each of usersIdArray) {
    //   let result = await _getUserById(each);
    //   if (result.success) users.push(result.user);
    // }
    let result = await _getUserById(usersIdArray);
    if (result.success) users.push(result.user);
    // temp1.filter((elem,index)=>temp1.findIndex(obj=>obj.user?._id==elem.user?._id)==index).filter(x=>x.user)
    res.send({ users: users[0].filter((elem, index) => users[0].findIndex(obj => obj.user?._id == elem.user?._id) == index).filter(x => x.user) });
    // res.send({ users });
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
    let user = await ChatState.find({ user: { $in: id } })
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
    const socketUser = await SocketRoom.findOne({ user: req.body.recipient })
    console.log(socketUser?.socket_id)
    // socketUser?.socket_id?.forEach((id) => {
    //   global.io.to(id).emit("newChat", chat);
    // })
    global.io.in(socketUser?.socket_id).emit("newChat", chat);
    // global.io.on('connection', function (socket) {
    //   global.io.to(socket.id).emit('private', `your secret code is ${socket.id}`);
    // });

    // global.io.on('identification', (data) => {
    //   const userId = data.userId;
    //   // Store the mapping of userId to socket.id
    //   // You can use an object, a Map, or a database to store this information
    //   // Example:
    //   // socketIdToUserIdMap[socket.id] = userId;
    // });

    // global.io.on('connection', (socket) => {
    //   socket.on('identification', (data) => {
    //     // const userId = data.userId;
    //     global.io.to(data.userId).emit('private', `your secret code is ${socket.id}`);
    //     // Store the mapping of userId to socket.id
    //     // You can use an object, a Map, or a database to store this information
    //     // Example:
    //     // socketIdToUserIdMap[socket.id] = userId;
    //   });

    //   // Handle disconnection and clean up the mapping
    //   socket.on('disconnect', () => {
    //     const userId = socketIdToUserIdMap[socket.id];
    //     // Perform any necessary cleanup related to the user's disconnection
    //     // Example:
    //     // delete socketIdToUserIdMap[socket.id];
    //   });
    // });
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
