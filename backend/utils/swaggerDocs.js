/**
 * @swagger
 * tags:
 *   name: OAuth
 */

// ===================== Oauth User Profile Retrieval ==================
/**
 * @swagger
 * /oauth/getUserProfle:
 *   get:
 *     tags: [OAuth]
 *     summary: Get user profile
 *     description: Returns user profile data based on the provided token.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 profile:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     description:
 *                       type: string
 *                     header_image:
 *                       type: string
 *                     tags:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     website:
 *                       type: string
 *                     zipCode:
 *                       type: string
 *                     recentlyActive:
 *                       type: string
 *                 trustedBy:
 *                   type: array
 *                   items:
 *                     oneOf:
 *                       - type: object
 *                   example: [{_id: "string", username: "string", name: "string", avatar: "string"}]
 *                 trustGiven:
 *                   type: array
 *                   items:
 *                     oneOf:
 *                       - type: object
 *                   example: [{_id: "string", username: "string", name: "string", avatar: "string"}]
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Too Many Requests
 */

// ===================== Oauth Balance Check ==================
/**
 * @swagger
 * /oauth/getUserBalance:
 *   get:
 *     tags: [OAuth]
 *     summary: Get user balance
 *     description: Returns user balance based on the provided token.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Too Many Requests
 */

// ===================== Oauth Credit Limit ==================
/**
 * @swagger
 * /oauth/getAllUser:
 *   get:
 *     tags: [OAuth]
 *     summary: Get all user
 *     description: Returns all user based on the provided token.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 profile:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     name:
 *                       type: string
 *                     recentlyActive:
 *                       type: string
 *                     job:
 *                       type: string
 *                     placeId:
 *                       type: string
 *                     website:
 *                       type: string
 *                 account:
 *                   type: object
 *                   properties:
 *                     balance:
 *                       type: number
 *                 joinedAt:
 *                   type: string
 *                 trustedBy:
 *                   type: array
 *                   items:
 *                     oneOf:
 *                       - type: object
 *                   example: [{_id: "string", username: "string", name: "string", avatar: "string"}]
 *                 trustGiven:
 *                   type: array
 *                   items:
 *                     oneOf:
 *                       - type: object
 *                   example: [{_id: "string", username: "string", name: "string", avatar: "string"}]
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Too Many Requests
 */

/**
 * @swagger
 * /oauth/checkedTrustLimit/{recipient}:
 *   get:
 *     tags: [OAuth]
 *     summary: Get truset limit
 *     description: Returns trust limit based on the provided token.
 *     parameters:
 *       - in: path
 *         name: recipient
 *         required: true
 *         description: Enter the user's _id from the get all user api
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trustLimit:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Too Many Requests
 *       400:
 *         description: Error
 */

// ===================== Oauth Transaction History ==================
/**
 * @swagger
 * /oauth/transaction-history:
 *   post:
 *     tags: [OAuth]
 *     summary: Get user transaction history
 *     description: Returns user transaction history based on the provided token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dateRange:
 *                 type: array
 *                 items:
 *                   oneOf:
 *                     - type: string
 *                     - type: null
 *                 example: ["YYYY-MM-DDTHH:mm:ss.sssZ", "YYYY-MM-DDTHH:mm:ss.sssZ"]
 *               viewport:
 *                 type: object
 *                 properties:
 *                   description:
 *                     type: string
 *                   placeId:
 *                     type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 total:
 *                   type: number
 *                 transactions:
 *                   type: array
 *                   items:
 *                     oneOf:
 *                       - type: object
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Too Many Requests
 */

// ===================== Oauth Initiate Transactions =================
/**
 * @swagger
 * /oauth/initiateTransaction:
 *   post:
 *     tags: [OAuth]
 *     summary: Get initiate transaction history
 *     description: Returns initiate transaction history based on the provided token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipient:
 *                 type: string
 *               amount:
 *                 type: number
 *               memo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 paylogs:
 *                   type: array
 *                   items:
 *                    oneOf:
 *                      - type: object
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Too Many Requests
 *       400:
 *         description: Error
 */

// ===================== Oauth Initiate Trust Line =================
/**
 * @swagger
 * /oauth/initiateTrustLine:
 *   post:
 *     tags: [OAuth]
 *     summary: Get initiate trust line
 *     description: Returns initiate trust line based on the provided token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipient:
 *                 type: string
 *               text:
 *                 type: string
 *               weight:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 weight:
 *                   type: number
 *                 text:
 *                   type: string
 *                 recipientId:
 *                   type: string
 *                 endorserId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *                 old_id:
 *                   type: number
 *                 deleted:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Too Many Requests
 */
