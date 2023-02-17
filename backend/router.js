const express = require("express");
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

// ######################### AUTH ROUTER #############################
router.get("/auth", authMiddleware.auth, authController.getUser);
router.post(
  "/auth/register",
  authMiddleware.register,
  authController.registerUser
);
router.get("/auth/verify/:id/:token", authController.verifyToken);
router.post("/auth/login", authMiddleware.login, authController.login);

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
router.post("/posting/posts", postController.searchPosts);
router.get("/posting/post/:id", postController.getById);
router.post(
  "/posting/upload",
  authMiddleware.auth,
  postMiddleware.upload.single("file"),
  postMiddleware.create,
  postController.createPost
);
router.get("/posting/getByUser/:userId", postController.getByUser);
router.delete("/posting/:id", postController.deleteById);

// ######################### SETTING ROUTER #############################
router.get("/setting", authMiddleware.auth, settingController.getById);

// ######################### POSTING ROUTER #############################
router.post("/users/search", userController.search);
router.get("/users/user/:id", userController.getById);
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
  "/users/password",
  authMiddleware.auth,
  userMiddleware.changePassword,
  authController.changePassword
);

// ######################### Admin ROUTER #############################
router.post(
  "/admin/users/avatar",
  authMiddleware.auth,
  userMiddleware.upload.single("file"),
  adminController.uploadAvatar
);

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
  "/admin/users/delete",
  authMiddleware.auth,
  adminController.deleteUser
);

// ######################### Trust ROUTER #############################
router.post(
  "/endorsement/save",
  authMiddleware.auth,
  endorsementMiddleware.save,
  endorsementController.save
);
router.post(
  "/endorsement/search",
  authMiddleware.auth,
  endorsementController.search
);
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

router.get("/map/users", mapController.getUsers);

module.exports = router;
