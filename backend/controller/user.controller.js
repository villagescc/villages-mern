const User = require('../models/User');
const Profile = require('../models/Profile');
const { _getFollowers, _getFollowings } = require('../controller/endorsement.controller');
const { _getBalanceById } = require('../controller/account.controller');

exports.search = async (req, res, next) => {
  let { keyword, page } = req.body;
  if(!page) page = 1;

  let query = {};
  try {
    if(keyword && keyword !== '') {
      query = {
        $or: [
          { firstName: { $regex: keyword, $options: 'i' } },
          { lastName: { $regex: keyword, $options: 'i' } },
          { email: { $regex: keyword, $options: 'i' } },
          { username: { $regex: keyword, $options: 'i' } }
          ]
      }
    }
    const users = await User.find(query)
      .populate('profile')
      .exec();
    /*
    user data format:
    {
      firstName, lastName,
      username,
      email,
      memberDate,
      location,
      job,
      description,
      avatar
      endorsedFrom: [],
      endorsedTo: [],
      balance,
    }
     */
    let userData = [];
    for(let i=0; i<[...users].slice((page-1)*10, page*10).length; i++) {
      let userInfo = await getUserDetail(users[i]['id']);
      userData.push(userInfo);
    }

    res.send({ total: users.length, users: userData })
  }
  catch(err) {
    console.log('filter error:', err);
    next(err);
  }
}

exports.getOne = async (req, res, next) => {
  try {
    const user = await getUserDetail(req.params.id);
    res.send(user);
  }
  catch(err) {
    next(err)
  }
}

const getUserDetail = async (id) => {
  let userInfo = {}
  const user = await User.findById(id);
  const profile = await Profile.findById(user.profile)

  userInfo.id = id;
  userInfo.firstName = user.firstName;
  userInfo.lastName = user.lastName;
  userInfo.username = user.username;
  userInfo.email = user.email;
  userInfo.memberDate = user.createdAt;
  userInfo.location = profile.location;
  userInfo.job = profile.job;
  userInfo.description = profile.description;
  userInfo.avatar = profile.avatar;
  userInfo.endorsedFrom = await _getFollowers(id);
  userInfo.endorsedTo = await _getFollowings(id);
  userInfo.balance = await _getBalanceById(user.account);

  return userInfo;
}
