const moongose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const username = encodeURIComponent(process.env.mongoUsername);
const password = encodeURIComponent(process.env.mongoPassword);

const isEmpty = require("../validation/is-empty");

//calling database using async await
const db =
  "mongodb+srv://" +
  username +
  ":" +
  password +
  "@cluster0.hu14qc2.mongodb.net/UserData?retryWrites=true&w=majority";

const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const Tag = require("../models/Tag");
const User = require("../models/User");
const Endorsement = require("../models/Endorsement");
const Profile = require("../models/Profile");
const Account = require("../models/Account");

const { RECORDS: users } = require("../DB/auth_user.json");
const { RECORDS: profiles } = require("../DB/profile_profile.json");
const { RECORDS: accounts } = require("../DB/account_account.json");
const { RECORDS: nodes } = require("../DB/account_node.json");
const { RECORDS: endorsements } = require("../DB/relate_endorsement.json");
const { RECORDS: categories } = require("../DB/categories_categories.json");
const {
  RECORDS: subCategories,
} = require("../DB/categories_subcategories.json");
const { RECORDS: tags } = require("../DB/tags_tag.json");

const profileController = require("../controller/profile.controller");
const accountController = require("../controller/account.controller");

const connectDB = async () => {
  try {
    try {
      await moongose.connect(db);
    } catch (err) {
      console.log("mongo connect error:", err);
    }

    async function initialDB() {
      Category.estimatedDocumentCount(async (err, count) => {
        if (!err && count === 0) {
          for (let category of categories) {
            let newCategory = await Category.create({
              title: category.categories_text,
            });
            let newSubCategories = subCategories
              .filter(
                (subCategory) => category.id === subCategory.categories_id
              )
              .map((subCategory) => ({
                title: subCategory.sub_categories_text,
                categoryId: newCategory.id,
              }));
            await Subcategory.insertMany(newSubCategories);
          }
        }
      });

      Tag.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
          Tag.insertMany(
            tags
              .filter((tag) => !isEmpty(tag.name))
              .map((tag) => ({
                title: tag.name.trim(),
              }))
          )
            .then(() => {
              console.log("Tags are initialized.");
            })
            .catch(() => {
              console.log("Tags cannot be initialized.");
            });
        }
      });
    }

    async function loadUsers(freshUsers = false) {
      let profile_to_user_ids = {};

      if (freshUsers) {
        await User.deleteMany({});
        await Profile.deleteMany({});
        await Account.deleteMany({});
      }

      if (users && users.length > 0) {
        for (const each of users) {
          let profile, account, user;
          try {
            const {
              id: user_id,
              username,
              first_name: firstName,
              last_name: lastName,
              email,
            } = each;
            if (isEmpty(email)) continue;

            user = await User.findOne({ $or: [{ email }, { username }] });
            if (user) continue;

            const token = crypto.randomBytes(32).toString("hex");
            user = new User({
              password: "123123",
              username,
              firstName,
              lastName,
              email,
              token,
            });

            let profileData = {
              user: user._id,
              name: `${firstName} ${lastName}`,
            };
            if (
              profiles &&
              profiles.find((profile) => profile?.user_id === user_id)
            ) {
              let oldProfile = profiles.find(
                (profile) => profile?.user_id === user_id
              );
              profileData = {
                ...profileData,
                description: oldProfile.description,
              };
              profile = await profileController._createProfile(profileData);

              let accountData = {
                user: user._id,
              };
              if (
                nodes &&
                nodes.find((node) => node?.alias === oldProfile.id)
              ) {
                let oldNode = nodes.find(
                  (node) => node?.alias === oldProfile.id
                );
                if (
                  accounts &&
                  accounts.find((account) => account?.id === oldNode.id)
                ) {
                  let oldAccount = accounts.find(
                    (account) => account?.id === oldNode.id
                  );
                  accountData.balance = oldAccount.balance;
                }
              }
              account = await accountController._createAccount(accountData);
            } else {
              profile = await profileController._createProfile(profileData);
              account = await accountController._createAccount({
                user: user._id,
                balance: 0,
              });
            }

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash("123123", salt);
            user.profile = profile._id;
            user.account = account._id;

            await user.save();
            if (
              profiles &&
              profiles.find((profile) => profile?.user_id === user_id)
            ) {
              profile_to_user_ids[
                profiles.find((profile) => profile?.user_id === user_id).id
              ] = user._id;
            }
          } catch (err) {
            console.log(err);
            if (profile) await profileController._removeProfileById(profile.id);
            if (account) await accountController._removeAccountById(account.id);
            if (user) await User.find({ id: user.id }).remove().exec();
          }
        }
      }

      if (endorsements && endorsements.length > 0) {
        for (const each of endorsements) {
          let endorsement;
          try {
            if (
              profile_to_user_ids[each.endorser_id] === undefined ||
              profile_to_user_ids[each.recipient_id] === undefined
            )
              continue;

            endorsement = await Endorsement.findOne({
              endorserId: profile_to_user_ids[each.endorser_id],
              recipientId: profile_to_user_ids[each.recipient_id],
            });

            if (endorsement) {
              endorsement.weight = each.weight;
              endorsement.text = each.text;
              await endorsement.save();
            } else {
              await Endorsement.create({
                weight: each.weight,
                text: each.text,
                endorserId: profile_to_user_ids[each.endorser_id],
                recipientId: profile_to_user_ids[each.recipient_id],
              });
            }
          } catch (err) {
            if (endorsement)
              await Endorsement.find({ id: endorsement.id }).remove().exec();
          }
        }
      }

      const adminUser = await User.findOne({ username: "dlevy" });
      if (adminUser.isSuperuser !== true) {
        adminUser.isSuperuser = true;
        adminUser.save();
      }
    }

    await initialDB();

    await loadUsers();

    console.log("MongoDb Connected..");
  } catch (err) {
    console.error(err.message);
    //exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
