const Account = require('../models/Account');
const Payment = require('../models/Payment');

exports._createAccount = async () => {
  const account = await Account.create();

  return account;
}
