const { default: mongoose } = require("mongoose");
const Chat = require("../models/Chat");
const ChatState = require("../models/ChatState");
const SocketRoom = require("../models/SocketRoom");
const User = require("../models/User");
const sendEmail = require("../utils/email");
const moment = require('moment')


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
    usersIdArray = usersIdArray.map(id => id)
    // for (each of usersIdArray) {
    //   let result = await _getUserById(each);
    //   if (result.success) users.push(result.user);
    // }
    // let result = await _getUserById(usersIdArray);
    let result = async () => {
      try {
        let user = await ChatState.aggregate([
          ...(usersIdArray.length !== undefined ? [{ $match: { user: { $in: usersIdArray } } }] : []),
          {
            $lookup: {
              from: "chats",
              localField: "user",
              foreignField: "sender",
              as: "sender",
              pipeline: [
                {
                  $match: {
                    $or: [{ sender: mongoose.Types.ObjectId(req.user._id) }, { recipient: mongoose.Types.ObjectId(req.user._id) }],
                  }
                },
                {
                  $addFields: {
                    createdAt: {
                      $toLong: {
                        $subtract: [
                          "$createdAt",
                          new Date("1970-01-01T00:00:00Z"),
                        ],
                      },
                    },
                  },
                },
                {
                  $sort: {
                    createdAt: -1,
                  },
                }
              ],
            },
          },
          {
            $lookup: {
              from: "chats",
              localField: "user",
              foreignField: "recipient",
              as: "recepient",
              pipeline: [
                {
                  $match: {
                    $or: [{ sender: mongoose.Types.ObjectId(req.user._id) }, { recipient: mongoose.Types.ObjectId(req.user._id) }],
                  }
                },
                {
                  $addFields: {
                    createdAt: {
                      $toLong: {
                        $subtract: [
                          "$createdAt",
                          new Date("1970-01-01T00:00:00Z"),
                        ],
                      },
                    },
                  },
                },
                {
                  $sort: {
                    createdAt: -1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              recepient: {
                $first: "$recepient",
              },
              sender: {
                $first: "$sender",
              },
            },
          },
          {
            $addFields: {
              latestMessageOn: {
                $cond: {
                  if: {
                    $gt: [
                      "$sender.createdAt",
                      "$recepient.createdAt",
                    ],
                  },
                  then: "$sender.createdAt",
                  else: "$recepient.createdAt",
                },
              },
            },
          },
          {
            $addFields: {
              latestMessage: {
                $cond: {
                  if: {
                    $gt: [
                      "$sender.createdAt",
                      "$recepient.createdAt",
                    ],
                  },
                  then: "$sender.text",
                  else: "$recepient.text",
                },
              },
            }
          },
          {
            $unset:
              ["sender", "recepient"],
          },
          // {
          //   $addFields: {
          //     latestMessageOn: {
          //       $toLong: {
          //         $subtract: [
          //           "$createdAt",
          //           new Date("1970-01-01T00:00:00Z"),
          //         ],
          //       },
          //     }
          //   }
          // },
          {
            $sort:
            {
              latestMessageOn: -1,
            },
          },
          {
            $lookup:
            {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user",
              pipeline: [
                {
                  $lookup: {
                    from: "profiles",
                    localField: "profile",
                    foreignField: "_id",
                    as: "profile",
                  },
                },
                {
                  $addFields: {
                    profile: {
                      $first: "$profile",
                    },
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              user: {
                $first: "$user",
              },
            },
          },
        ])
        if (user?.length == 0) {
          user = await User.findById(usersIdArray).populate("profile");
          if (user) {
            await ChatState.create({
              user: user._id,
              lastSeen: [],
            });
          }
          else {
            return {
              success: true,
              user: []
            }
          }
        }
        return {
          success: true,
          user,
        };
      } catch (error) {
        return { success: false, error };
      }
    }
    const resp = await result()
    if (resp.success) users.push(resp.user);
    let data = users?.[0]?.filter((elem, index) => users?.[0]?.findIndex(obj => obj?.user?._id?.toString() == elem?.user?._id?.toString()) == index).filter(x => x.user)
    // temp1.filter((elem,index)=>temp1.findIndex(obj=>obj.user?._id==elem.user?._id)==index).filter(x=>x.user)
    res.send({ users: data });
    // res.send({ users: users });
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
    usersIdArray = usersIdArray.map(id => mongoose.Types.ObjectId(id))
    // for (each of usersIdArray) {
    //   let result = await _getUserById(each);
    //   if (result.success) users.push(result.user);
    // }
    // let result = await _getUserById(usersIdArray);
    let result = async () => {
      try {
        // let user = await ChatState.find({ user: { $in: id } })
        //   .populate({
        //     path: "user",
        //     model: "user",
        //     populate: {
        //       path: "profile",
        //       model: "profile",
        //     },
        //   })
        //   .exec();
        let user = await ChatState.aggregate([
          ...(usersIdArray.length !== undefined ? [{ $match: { user: { $in: usersIdArray } } }] : []),
          {
            $lookup: {
              from: "chats",
              localField: "user",
              foreignField: "sender",
              as: "sender",
              pipeline: [
                {
                  $sort: {
                    createdAt: -1,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "chats",
              localField: "user",
              foreignField: "recipient",
              as: "recepient",
              pipeline: [
                {
                  $sort: {
                    createdAt: -1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              recepient: {
                $first: "$recepient",
              },
              sender: {
                $first: "$sender",
              },
            },
          },
          {
            $addFields:
            {
              latestMessageOn: {
                $cond: {
                  if: {
                    $gt: [
                      "$sender.createdAt",
                      "$recipient.createdAt",
                    ],
                  },
                  then: "$sender.createdAt",
                  else: "$recipient.createdAt",
                },
              },
            },
          },
          {
            $unset:
              ["sender", "recepient"],
          },
          {
            $sort:
            {
              latestMessageOn: -1,
            },
          },
          {
            $lookup:
            {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user",
              pipeline: [
                {
                  $lookup: {
                    from: "profiles",
                    localField: "profile",
                    foreignField: "_id",
                    as: "profile",
                  },
                },
                {
                  $addFields: {
                    profile: {
                      $first: "$profile",
                    },
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              user: {
                $first: "$user",
              },
            },
          },
        ])
        if (user?.length == 0) {
          user = await User.findById(usersIdArray).populate("profile");
          if (user) {
            await ChatState.create({
              user: user._id,
              lastSeen: [],
            });
          }
          else {
            return {
              success: true,
              user: []
            }
          }
        }
        return {
          success: true,
          user,
        };
      } catch (error) {
        return { success: false, error };
      }
    }
    const resp = await result()
    if (resp.success) users.push(resp.user);
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
    if (user?.length == 0) {
      user = await User.findById(id).populate("profile");
      if (user) {
        await ChatState.create({
          user: user._id,
          lastSeen: [],
        });
      }
      else {
        return {
          success: true,
          user: []
        }
      }
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

    const { authUser, loggedInUser: user } = req.body
    const senderUser = await SocketRoom.findOne({ user: req.body.sender }).select("socket_id")
    const receiverUser = await SocketRoom.findOne({ user: req.body.recipient }).select("socket_id")
    // console.log(senderUser, "sender")
    // console.log(receiverUser, "receiver")
    let sendersID = senderUser.socket_id?.filter(x => x !== req.body.senderSocketId)
    let receiverId = receiverUser ? receiverUser.socket_id : []
    // console.log(sendersID, "senderID")
    let newIds = [...receiverId, ...sendersID]
    // console.log(newIds, "New IDS")
    // newIds?.forEach((id) => {
    //   console.log(id, "ID 123")
    //   global.io.to(id).emit("newChat", chat);
    // })

    await Promise.all(
      newIds.map((item) => {
        // console.log(item)
        global.io.to(item).emit("newChat", chat);
      })
    )

    sendEmail(req.body.senderEmail, req.body.recipientEmail, "Chat Message Notification", `<h1>You have unread message from ${authUser?.firstName} ${authUser?.lastName}</h1>
    <h2>Hello ${user?.user?.firstName} ${user?.user?.lastName}</h2>
    <p>New message arrived from ${authUser?.firstName} ${authUser?.lastName}(${authUser.username}) like below:</p>
    <br>
    <div style="border: 2px solid #dedede; background-color:#f1f1f1; border-radius: 20px; padding 10px; margin: 10px 0; width:60%">
      <p>${req.body.text}</p>
      <span style="float:right; color:#999">${moment().format('YYYY-MM-DD HH:mm:ss')}</span>
    </div>
    <br>
    To go to check message directly <a href=https://villages.io/personal/message/${authUser._id}> Click here</a>
    <br>`).then(function (response) {
      console.log(response);
    })
      .catch(function (error) {
        console.log(error);
      })

    // global.io.on('connection', (socket) => {
    //   socket.broadcast.in(socketUser?.socket_id).emit("newChat", chat);
    // })
    // global.io.on("connection", function (socket) {
    //   socket.to("some room").emit("some event");
    // });
    // global.io.on('connection', (socket) => {
    //   socket.on('joinroom', function (data) {
    //     socket.join(data)
    //   })
    // })
    var roomno = 1;
    // global.io.on('newChat', (data) => {
    // global.io.in('roomname').emit('newChat', {
    //   sender: req.body.sender,
    //   recipient: req.body.recipient,
    //   text: req.body.text,
    // });
    // })
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
