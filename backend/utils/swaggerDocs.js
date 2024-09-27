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
 *                 trustedBy:
 *                   type: array
 *                   items:
 *                     oneOf:
 *                       - type: object
 *                 trustGiven:
 *                   type: array
 *                   items:
 *                     oneOf:
 *                       - type: object
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
 */

// ===================== Oauth Credit Limit ==================
/**
 * @swagger
 * /oauth/getAllUser:
 *   get:
 *     tags: [OAuth]
 *     summary: Get all credit user
 *     description: Returns all credit user based on the provided token.
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
 *                 account:
 *                   type: object
 *                 joinedAt:
 *                   type: string
 *                 trustedBy:
 *                   type: array
 *                   items:
 *                     oneOf:
 *                       - type: object
 *                 trustGiven:
 *                   type: array
 *                   items:
 *                     oneOf:
 *                       - type: object
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
 *         description: The recipient's identifier for which the trust limit is being requested.
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
 *               page:
 *                 type: number
 *                 example: 1
 *               dateRange:
 *                 type: array
 *                 items:
 *                   oneOf:
 *                     - type: string
 *                     - type: null
 *                 example: ["date", "date"]
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
 *                 example: 641bb6acbdb8052f8806e636
 *               amount:
 *                 type: number
 *                 example: 0
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
 *                 example: 641bb6acbdb8052f8806e636
 *               text:
 *                 type: string
 *               weight:
 *                 type: string
 *                 example: 19
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
 */