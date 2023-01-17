const User = require("../models/User");
const Profile = require("../models/Profile");
const Account = require("../models/Account");
const {
  _getFollowers,
  _getFollowings,
} = require("../controller/endorsement.controller");
const { _getBalanceById } = require("../controller/account.controller");
const Listing = require("../models/Listing");

exports.search = async (req, res, next) => {
  let { keyword, page } = req.body;
  if (!page) page = 1;

  let query = {};
  try {
    if (keyword && keyword !== "") {
      query = {
        $or: [
          { firstName: { $regex: keyword, $options: "i" } },
          { lastName: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
          { username: { $regex: keyword, $options: "i" } },
        ],
      };
    }
    const users = await User.find(query).populate("profile").exec();
    /*
    user data format:
    {
      firstName, lastName,
      username,
      email,
      memberDate,
      placeId,
      job,
      description,
      avatar
      followers: [],
      followings: [],
      account,
    }
     */
    let userData = [];
    for (
      let i = 0;
      i < [...users].slice((page - 1) * 10, page * 10).length;
      i++
    ) {
      let userInfo = await getUserDetail(users[i]["id"]);
      userData.push(userInfo);
    }

    res.send({ total: users.length, users: userData });
  } catch (err) {
    console.log("filter error:", err);
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const user = await getUserDetail(req.params.id);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const getUserDetail = async (id) => {
  // let userInfo = {};
  const user = await User.findById(id).exec();
  const profile = await Profile.findOne({ user: id });
  const account = await Account.findOne({ user: id });
  // TODO update fields name in model
  const postings = await Listing.findOne({ userId: id });

  const userInfo = {
    ...user._doc,
    account,
    profile,
    postings,
    followers: await _getFollowers(id),
    followings: await _getFollowings(id),
  };
  // userInfo.id = id;
  // userInfo.firstName = user.firstName;
  // userInfo.lastName = user.lastName;
  // userInfo.username = user.username;
  // userInfo.email = user.email;
  // userInfo.memberDate = user.createdAt;
  // userInfo.placeId = profile.placeId;
  // userInfo.job = profile?.job;
  // userInfo.description = profile?.description;
  // userInfo.avatar = profile?.avatar;
  // userInfo.followers = await _getFollowers(id);
  // userInfo.followings = await _getFollowings(id);
  // userInfo.account = account;

  return userInfo;
};

exports.uploadAvatar = async (req, res, next) => {
  const uploadFile = req.file;
  try {
    await Profile.findByIdAndUpdate(req.user.profile, {
      avatar: uploadFile.filename,
    });
    res.send({ success: true });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.saveProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, job, placeId, description } = req.body;
    let user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { firstName, lastName }
    );
    await Profile.findOneAndUpdate(
      { _id: user.profile },
      { job, description, placeId }
    );
    user = await getUserDetail(req.user._id);
    res.send({ success: true, user });
  } catch (err) {
    next(err);
  }
};
