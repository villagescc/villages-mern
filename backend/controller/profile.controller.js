const Profile = require('../models/Profile');

// @desc: Create fresh profile with data.
// @return: profile object
exports._createProfile = async (data) => {
  const profile = await Profile.create(data);

  return profile;
}

exports._removeProfileById = async id => {
  return Profile.deleteOne({ id });
}
