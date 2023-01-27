const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

exports.broadcast = functions.https.onRequest(async (req, res) => {
  // [END addMessageTrigger]
  // Grab the text parameter.
  const { receiverFcm, message } = req.query;

  const payload = {
    notification: {
      title: `Villages.io`,
      body: message
        ? message.length <= 100
          ? message
          : message.substring(0, 97) + "..."
        : "",
    },
  };

  if (receiverFcm) {
    // Send notifications to all tokens.
    const response = await admin
      .messaging()
      .sendToDevice([receiverFcm], payload);
    functions.logger.log("Notifications have been sent and tokens cleaned up.");
  }
});
