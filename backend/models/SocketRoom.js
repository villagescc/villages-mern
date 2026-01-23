const mongoose = require('mongoose');

const SocketRoomSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId
        },
        socket_id: {
            type: [String],
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = SocketRoom = mongoose.model('SocketRoom', SocketRoomSchema);
