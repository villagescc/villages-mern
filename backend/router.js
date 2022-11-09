const express = require('express');
const router = express.Router();
const authMiddleware = require('./middleware/auth');
const postMiddleware = require('./middleware/posting');
const endorsementMiddleware = require('./middleware/endorsement');
const notificationMiddleware = require('./middleware/notification');

const authController = require('./controller/auth');
const baseController = require('./controller/base');
const postController = require('./controller/posting');
const endorsementController = require('./controller/endorsement');
const notificationController = require('./controller/notification');

// ######################### AUTH ROUTER #############################
router.get('/auth', authMiddleware.auth, authController.getUser);
router.post('/auth/register', authMiddleware.register, authController.registerUser)
router.get('/auth/verify/:id/:token', authController.verifyToken)
router.post('/auth/login', authMiddleware.login, authController.login)

// ######################### BASE ROUTER #############################
router.get('/base/tags', baseController.getTags);
router.get('/base/categories', baseController.getCategories);
router.get('/base/subCategories/:categoryId', baseController.getSubcategories);

// ######################### POSTING ROUTER #############################
router.post('/posting/posts', postController.searchPosts);
router.post('/posting/upload', postMiddleware.create, postMiddleware.upload.single('file'), postController.createPost);

// ######################### Trust ROUTER #############################
router.post('/endorsement/save', authMiddleware.auth, endorsementMiddleware.save, endorsementController.save)

// ######################### NOTIFICATION ROUTER #############################
router.post('/notification/create', authMiddleware.auth, notificationMiddleware.create, notificationController.create)

module.exports = router;
