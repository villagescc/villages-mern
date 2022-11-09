const Endorsement = require('../models/Endorsement');
const User = require('../models/User');

exports.save = async (req, res, next) => {
  let errors = {};
  const { recipient, amount, text, referred } = req.body;
  const recipientUser = await User.findById(recipient);
  if(!recipientUser) {
    errors.recipient = "Recipient does not exist.";
    return res.status(404).send(errors);
  }
  if(req.user._id === recipient) {
    errors.recipient = "You can't send trust to yourself.";
    return res.status(400).send(errors);
  }

  try {
    let endorsement = await Endorsement.findOne({ recipientId: recipientUser._id, endorserId: req.body._id });
    if(!endorsement) {
      endorsement = await Endorsement.create({ recipientId: recipientUser._id, endorserId: req.body._id, amount, text, referred })
    }
    else {
      endorsement.amount = amount;
      endorsement.text = text;
      endorsement.referred = referred;
      await endorsement.save();
    }
    res.send(endorsement)
  }
  catch(err) {
    res.status(400).send(err);
  }
}

exports.search = async (req, res, next) => {
  const { keyword, page } = req.body;
  try {
    const total = await Endorsement.countDocuments();
    const query = Endorsement.find();
    if(keyword && keyword !== '') {
      const users = await User.find({ $or: [ { firstName: { $regex: keyword, $options: 'i' } }, { lastName: { $regex: keyword, $options: 'i' } }, { email: { $regex: keyword, $options: 'i' } }, { username: { $regex: keyword, $options: 'i' } } ] })
      query.or([
        { recipientId: { $in: [ ...users.map(user => user._id), req.user._id ] } },
        { endorserId: { $in: [ ...users.map(user => user._id), req.user._id ] } },
        { text: { $regex: keyword, $options: 'i' } }
      ]);
    }
    query.skip(page * 12 - 12).limit(12);
    const endorsements = await query.populate({ path: 'recipientId', model: 'user', populate: { path: 'profile', model: 'profile' } }).exec();
    res.send({ total, endorsements })
  }
  catch(err) {
    console.log('filter error:', err);
    next(err);
  }
}
