const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

const admin = require("firebase-admin");
admin.initializeApp();

exports.broadcast = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    // [END addMessageTrigger]
    // Grab the text parameter.
    const { receiverFcm, message } = req.body;

    functions.logger.log("get broadcast request", receiverFcm, message);

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
      functions.logger.log(response);
      functions.logger.log(
        "Notifications have been sent and tokens cleaned up.",
        response
      );
      return res.send({ success: true });
    }
  });
});
