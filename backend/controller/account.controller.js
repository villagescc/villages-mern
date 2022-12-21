const Account = require('../models/Account');

exports.create = async (req, res, next) => {
  const { accountName } = req.body;
  const result = await this._createAccount(req.user._id, accountName);
  if(result.success) res.send(result.account);
  else next(result.error);
}

// TODO: calculate with limit
exports._getBalanceById = (id) => {
  const account = Account.findById(id);
  return account.balance ? account.balance : 0;
}

exports._createAccount = async () => {
  const account = await Account.create({});

  return account;
}

exports._removeAccountById = id => {
  return Account.deleteOne({ id })
}
