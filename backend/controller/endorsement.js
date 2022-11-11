const Endorsement = require('../models/Endorsement');
const User = require('../models/User');

exports.save = async (req, res, next) => {
  let errors = {};
  const { recipient, weight, text, referred } = req.body;
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
    let endorsement = await Endorsement.findOne({ recipientId: recipientUser._id, endorserId: req.user._id });
    if(!endorsement) {
      endorsement = await Endorsement.create({ recipientId: recipientUser._id, endorserId: req.user._id, weight, text, referred })
    }
    else {
      endorsement.weight = weight;
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
    console.log(req.user._id)
    query.or([
      { endorserId: req.user._id },
      { recipientId: req.user._id }
    ]);
    if(keyword && keyword !== '') {
      const users = await User.find({ $or: [ { firstName: { $regex: keyword, $options: 'i' } }, { lastName: { $regex: keyword, $options: 'i' } }, { email: { $regex: keyword, $options: 'i' } }, { username: { $regex: keyword, $options: 'i' } } ] })
      query.or([
        { recipientId: { $in: users.map(user => user._id) } },
        { text: { $regex: keyword, $options: 'i' } }
      ]);
    }
    query.skip(page * 12 - 12).limit(12);
    const endorsements = await query.populate({ path: 'recipientId', model: 'user', populate: { path: 'profile', model: 'profile' } }).exec();
    console.log(endorsements.length)
    let endorsements_group = {};
    for(let i=0; i< endorsements.length; i++) {
      if(endorsements[i].endorserId._id.toString() === req.user._id) {
        if(Object.keys(endorsements_group).includes(endorsements[i].recipientId._id)) {
          endorsements_group[endorsements[i].recipientId._id] = { ...endorsements_group[endorsements[i].recipientId._id], send_weight: endorsements[i].weight, send_text: endorsements[i].text }
        }
        else {
          endorsements_group[endorsements[i].recipientId._id] = { send_weight: endorsements[i].weight, send_text: endorsements[i].text, user: endorsements[i].recipientId }
        }
      }
      else if(endorsements[i].recipientId._id.toString() === req.user._id) {
        if(Object.keys(endorsements_group).includes(endorsements[i].endorserId._id)) {
          endorsements_group[endorsements[i].endorserId._id] = { ...endorsements_group[endorsements[i].endorserId._id], recieve_weight: endorsements[i].weight, receive_text: endorsements[i].text }
        }
        else {
          endorsements_group[endorsements[i].endorserId._id] = { recieve_weight: endorsements[i].weight, receive_text: endorsements[i].text, user: endorsements[i].endorserId }
        }
      }
    }
    res.send({ total, endorsements: endorsements_group })
  }
  catch(err) {
    console.log('filter error:', err);
    next(err);
  }
}
