const Account = require('../models/Account');

// TODO: calculate with limit
exports._getBalanceById = (id) => {
  const account = Account.findById(id);
  return account.balance ? account.balance : 0;
}
