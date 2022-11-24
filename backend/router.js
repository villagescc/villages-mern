const express = require('express');
const router = express.Router();
const authMiddleware = require('./middleware/auth.middleware');
const postMiddleware = require('./middleware/posting.middleware');
const userMiddleware = require('./middleware/user.middleware');
const endorsementMiddleware = require('./middleware/endorsement.middleware');
const notificationMiddleware = require('./middleware/notification.middleware');

const authController = require('./controller/auth.controller');
const baseController = require('./controller/base.controller');
const postController = require('./controller/posting.controller');
const userController = require('./controller/user.controller');
const endorsementController = require('./controller/endorsement.controller');
const notificationController = require('./controller/notification.controller');

// ######################### AUTH ROUTER #############################
router.get('/auth', authMiddleware.auth, authController.getUser);
router.post('/auth/register', authMiddleware.register, authController.registerUser)
router.get('/auth/verify/:id/:token', authController.verifyToken)
router.post('/auth/login', authMiddleware.login, authController.login)

// ######################### BASE ROUTER #############################
router.get('/base/tags', baseController.getTags);
router.get('/base/categories', baseController.getCategories);
router.get('/base/subCategories/:categoryId', baseController.getSubcategories);
router.get('/base/users/getRecipients', authMiddleware.auth, baseController.getRecipients);

// ######################### POSTING ROUTER #############################
router.post('/posting/posts', postController.searchPosts);
router.post('/posting/upload', authMiddleware.auth, postMiddleware.upload.single('file'), postMiddleware.create, postController.createPost);

// ######################### POSTING ROUTER #############################
router.post('/users/search', userController.search);
router.get('/users/user/:id', userController.getOne);

// ######################### Trust ROUTER #############################
router.post('/endorsement/save', authMiddleware.auth, endorsementMiddleware.save, endorsementController.save)
router.post('/endorsement/search', authMiddleware.auth, endorsementController.search)
router.get('/endorsement/followers/:id', endorsementController.getFollowers)
router.get('/endorsement/followings/:id', endorsementController.getFollowings)

// ######################### Payment ROUTER #############################
// router.post('/payment/')

// ######################### NOTIFICATION ROUTER #############################
router.post('/notification/create', authMiddleware.auth, notificationMiddleware.create, notificationController.create)
router.get('/notification/getByUser', authMiddleware.auth, notificationController.getByUser)
router.put('/notification/readAllByUser', authMiddleware.auth, notificationController.readAllByUser)

module.exports = router;
