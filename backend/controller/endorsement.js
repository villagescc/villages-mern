const Endorsement = require('../models/Endorsement');
const User = require('../models/User');

exports.create = async (req, res, next) => {
  let errors = {};
  const { recipient, amount, text, referred } = req.body;
  const recipientUser = await User.findById(recipient);
  if(!recipient) {
    errors.recipient = "Recipient does not exist.";
    return res.status(404).send(errors);
  }
  if(req.user._id === recipient) {
    errors.recipient = "You can't send trust to yourself.";
    return res.status(400).send(errors);
  }

}
