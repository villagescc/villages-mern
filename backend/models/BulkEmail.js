const mongoose = require('mongoose');

const bulkEmailSchema = new mongoose.Schema(
    {
        email: {
            type: String,
        },
        users: {
            type: []
        },
        posts: {
            type: []
        },
    },
    {
        timestamps: true
    }
);

module.exports = bulkEmail = mongoose.model('bulk_emails', bulkEmailSchema);
