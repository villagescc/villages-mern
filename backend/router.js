const express = require("express");
const path = require("path");
const fs = require("fs");
const builder = require("xmlbuilder")
const router = express.Router();
const authMiddleware = require("./middleware/auth.middleware");
const postMiddleware = require("./middleware/posting.middleware");
const userMiddleware = require("./middleware/user.middleware");
const accountMiddleware = require("./middleware/account.middleware");
const endorsementMiddleware = require("./middleware/endorsement.middleware");
const paymentMiddleware = require("./middleware/payment.middleware");
const notificationMiddleware = require("./middleware/notification.middleware");

const authController = require("./controller/auth.controller");
const baseController = require("./controller/base.controller");
const postController = require("./controller/posting.controller");
const userController = require("./controller/user.controller");
const adminController = require("./controller/admin.controller");
const settingController = require("./controller/setting.controller");
const accountController = require("./controller/account.controller");
const endorsementController = require("./controller/endorsement.controller");
const paymentController = require("./controller/payment.controller");
const mapController = require("./controller/map.controller");
const notificationController = require("./controller/notification.controller");
const chatController = require("./controller/chat.controller");
const socketController = require("./controller/socket.controller");
const Listing = require("./models/Listing");
const User = require("./models/User");

// ######################### AUTH ROUTER #############################
router.get("/auth", authMiddleware.auth, authController.getUser);
router.post(
  "/auth/register",
  authMiddleware.register,
  authController.registerUser
);
router.get("/auth/verify/:id/:token", authController.verifyToken);
router.get("/auth/resendEmail/:email", authController.resendVerificationMail);
router.post("/auth/login", authMiddleware.login, authController.login);
router.post("/auth/forgot-password", authController.forgotPassword);
router.post("/auth/reset-password/:id/:token", authController.resetPassword);

// ######################### BASE ROUTER #############################
router.get("/base/tags", baseController.getTags);
router.get("/base/categories", baseController.getCategories);
router.get("/base/subCategories/:categoryId", baseController.getSubcategories);
router.get(
  "/base/users/getRecipients",
  authMiddleware.auth,
  baseController.getRecipients
);

// ######################### POSTING ROUTER #############################
router.post("/posting/posts", authMiddleware.auth, postController.searchPosts);
router.get("/posting/post/:id", postController.getById);
router.post("/posting/post/getMarketPlaceProfile", postController.getMarketPlaceProfile);
router.get("/posting/post/:username/:title", postController.getByUsernameAndTitle);
router.post(
  "/posting/upload",
  authMiddleware.auth,
  postMiddleware.upload.single("file"),
  postMiddleware.create,
  postController.createPost
);
router.post('/posting/purchase', authMiddleware.auth, postController.purchase)
router.post('/posting/purchase/getPurchaseLimit', authMiddleware.auth, postController.purchaseLimit)
router.get("/posting/getByUser/:userId", postController.getByUser);
router.delete("/posting/:id", postController.deleteById);

// ######################### SETTING ROUTER #############################
router.get("/setting", authMiddleware.auth, settingController.getById);

// ######################### USER ROUTER #############################
router.post("/users/search", userController.search);
router.get("/users/user/:id", userController.getById);
router.get("/users/username/:username", userController.getByUserName);
router.post(
  "/users/avatar",
  authMiddleware.auth,
  userMiddleware.upload.single("file"),
  userController.uploadAvatar
);
router.post(
  "/users/profile",
  authMiddleware.auth,
  userMiddleware.saveProfile,
  userController.saveProfile
);
router.post(
  "/users/profile/setting",
  authMiddleware.auth,
  userController.saveProfileSetting
);
router.post(
  "/users/password",
  authMiddleware.auth,
  userMiddleware.changePassword,
  authController.changePassword
);
router.get("/users/deactive", authMiddleware.auth, userController.deactive);

// ######################### Admin ROUTER #############################
router.post(
  "/admin/users/avatar",
  authMiddleware.auth,
  userMiddleware.upload.single("file"),
  adminController.uploadAvatar
);

router.get("/admin/user/:id", authMiddleware.auth, adminController.getUserByID);

router.post(
  "/admin/users/edit",
  authMiddleware.auth,
  adminController.editUserData
);

router.post(
  "/admin/users/activate",
  authMiddleware.auth,
  adminController.userActivate
);
router.post(
  "/admin/users/verify",
  authMiddleware.auth,
  adminController.userVerification
);

router.post(
  "/admin/users/delete",
  authMiddleware.auth,
  adminController.deleteUser
);

router.post(
  "/admin/users/search",
  authMiddleware.auth,
  adminController.search
);

router.post(
  "/admin/users/getMostConnectedUsers",
  authMiddleware.auth,
  adminController.getMostConnectedUsers
);

router.post(
  "/admin/users/getMostActiveUsers",
  authMiddleware.auth,
  adminController.getMostActiveUsers
);

// admin transaction history

router.post(
  "/admin/users/getPaymentHistory",
  authMiddleware.auth,
  adminController.getPaymentHistory
);

router.post(
  "/admin/users/export/transactionHistory",
  authMiddleware.auth,
  adminController.transactionHistory
);

router.post(
  "/admin/users/edit/transactionHistory",
  authMiddleware.auth,
  adminController.editTransactionHistory
);

router.post(
  "/admin/users/delete/transactionHistory",
  authMiddleware.auth,
  adminController.deleteTransactionHistory
);

// admin trust history

router.post(
  "/admin/users/getTrustHistory",
  authMiddleware.auth,
  adminController.getTrustHistory
);

router.post(
  "/admin/users/export/trustHistory",
  authMiddleware.auth,
  adminController.trustHistory
);

router.post(
  "/admin/users/edit/trustHistory",
  authMiddleware.auth,
  adminController.editTrustHistory
);

router.post(
  "/admin/users/delete/trustHistory",
  authMiddleware.auth,
  adminController.deleteTrustHistory
);

// router.post(
//   "/admin/users/getVillageHours",
//   authMiddleware.auth,
//   adminController.getVillagesHours
// );

router.post(
  "/admin/users/getAnalytics",
  authMiddleware.auth,
  adminController.getAnalytics
);

router.post(
  "/admin/users/getRecentPayments",
  authMiddleware.auth,
  adminController.getRecentPayments
);

// ######################### Trust ROUTER #############################
router.post(
  "/endorsement/save",
  authMiddleware.auth,
  endorsementMiddleware.save,
  endorsementController.save
);
router.post(
  "/endorsement/delete",
  authMiddleware.auth,
  // endorsementMiddleware.delete,
  endorsementController.delete
);
router.post(
  "/endorsement/search",
  authMiddleware.auth,
  endorsementController.search
);
router.get("/endorsement/getEndrosmentbyId/:id", authMiddleware.auth, endorsementController.getEndrosmentbyId);
router.get("/endorsement/followers/:id", endorsementController.getFollowers);
router.get("/endorsement/followings/:id", endorsementController.getFollowings);

// ######################### Account ROUTER #############################
router.post(
  "/account/create",
  authMiddleware.auth,
  accountMiddleware.create,
  accountController.create
);

// ######################### Payment ROUTER #############################
router.get(
  "/payment/getMaxLimit/:recipient",
  authMiddleware.auth,
  paymentController.getMaxLimit
);
router.post(
  "/payment/pay",
  authMiddleware.auth,
  paymentMiddleware.pay,
  paymentController.pay
);
router.get("/payment/getGraph", paymentController.getGraph);
router.post(
  "/payment/getPath",
  paymentMiddleware.getPath,
  paymentController.getPath
);
router.post(
  "/payment/transactions",
  authMiddleware.auth,
  paymentMiddleware.searchTransactions,
  paymentController.searchTransactions
);
router.get("/payment/transaction/:id", paymentController.getTransaction);

// ######################### NOTIFICATION ROUTER #############################
router.post(
  "/notification/create",
  authMiddleware.auth,
  notificationMiddleware.create,
  notificationController.create
);
router.get(
  "/notification/getByUser",
  authMiddleware.auth,
  notificationController.getByUser
);
router.put(
  "/notification/readAllByUser",
  authMiddleware.auth,
  notificationController.readAllByUser
);
router.put(
  "/notification/deleteAllByUser",
  authMiddleware.auth,
  notificationController.deleteAllByUser
);

// ######################### CHAT ROUTER #############################
router.get("/chat/users", authMiddleware.auth, chatController.getUsers);
// TODO keyword validate
router.post(
  "/chat/users/search",
  authMiddleware.auth,
  chatController.searchUsers
);
router.get("/chat/user/:id", chatController.getUserById);
router.post(
  "/chat/chats/filter",
  authMiddleware.auth,
  chatController.getChatsByUserId
);
// TODO input validate
router.post("/chat/create", authMiddleware.auth, chatController.createChat);
router.get("/chat/state", authMiddleware.auth, chatController.getState);
router.put("/chat/state", authMiddleware.auth, chatController.setState);

// ######################### MAP ROUTER #############################
router.get("/map/users", authMiddleware.auth, mapController.getUsers);
router.post("/map/posts", authMiddleware.auth, mapController.mapPosts);

// ######################### SEO Sitemap ROUTER #############################
router.post('/userConnected', authMiddleware.auth, socketController.createSocketUser)
router.post('/userDisconnected', socketController.removeSocketUser)

// ######################### SEO Sitemap ROUTER #############################
router.get('/sitemap.xml', async (req, res, next) => {
  res.sendFile(path.join(path.join(__dirname), 'sitemap.xml'))
})

router.get('/root.xml', async (req, res, next) => {
  res.sendFile(path.join(path.join(__dirname), 'root.xml'))
})

router.get('/people.xml', async (req, res, next) => {
  const allRoutes = await User.find({})
  const root = builder.create('urlset', { version: '1.0', encoding: 'UTF-8' });
  root.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
  allRoutes.map(e => {
    const url = root.ele('url');
    url.ele('loc', `https://villages.io/${e.username}`);
    url.ele('lastmod', new Date(e.updatedAt).toISOString());
    url.ele('changefreq', 'daily');
    url.ele('priority', '0.8');
  })
  const sitemapXml = root.end({ pretty: true });
  fs.writeFileSync('./people.xml', sitemapXml, 'utf8')
  res.sendFile(path.join(path.join(__dirname), 'people.xml'))
})

router.get('/post.xml', async (req, res, next) => {
  const allRoutes = await Listing.find({}).populate('userId')
  const root = builder.create('urlset', { version: '1.0', encoding: 'UTF-8' });
  root.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
  allRoutes.map(e => {
    const url = root.ele('url');
    url.ele('loc', `https://villages.io/${e.userId.username}/${encodeURIComponent(e.title)}`);
    url.ele('lastmod', new Date(e.updatedAt).toISOString());
    url.ele('changefreq', 'daily');
    url.ele('priority', '0.8');
  })
  const sitemapXml = root.end({ pretty: true });
  fs.writeFileSync('./post.xml', sitemapXml, 'utf8')
  res.sendFile(path.join(path.join(__dirname), 'post.xml'))
})

module.exports = router;
