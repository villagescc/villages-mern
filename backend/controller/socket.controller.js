const express = require("express");
const SocketRoom = require("../models/SocketRoom");

exports.createSocketUser = async (req, res, next) => {
    try {
        await SocketRoom.updateOne({ user: req.body.userId }, { $push: { socket_id: req.body.id } }, { upsert: true })
        res.send({ success: true })
    } catch (error) {
        next(error);
    }
};
exports.removeSocketUser = async (req, res, next) => {
    try {
        await SocketRoom.updateOne({ user: req.body.userId }, { $pull: { socket_id: req.body.id } }, { upsert: true })
        res.send({ success: true })
    } catch (error) {
        next(error);
    }
};