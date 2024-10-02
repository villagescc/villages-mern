const mongoose = require("mongoose");

const DeveloperSettingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        applicationName: {
            type: String,
        },
        clientSecret: {
            type: String,
        },
        secretKey: {
            type: String,
        },
        redirectUrl: {
            type: String
        },
        whitelistedEndpoint: [
            {
                type: String,
            },
        ],
        isApproved: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = DeveloperSetting = mongoose.model("developerSetting", DeveloperSettingSchema);
