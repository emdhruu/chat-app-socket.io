"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.server = exports.io = exports.getReceiverSocketId = void 0;
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.MODE === "development" ? ["http://localhost:5173"] : "*",
        credentials: true
    }
});
exports.io = io;
// function to get receiver socket id
const getReceiverSocketId = (receiverId) => {
    return onlineUsers[receiverId];
};
exports.getReceiverSocketId = getReceiverSocketId;
//used to store online users
const onlineUsers = {};
io.on("connection", (socket) => {
    console.log("A new socket user connected", socket.id);
    const userId = socket.handshake.query.userId;
    console.log(`User is connected with id ${userId} with ${socket.id}`);
    if (userId)
        onlineUsers[userId] = socket.id;
    //send online users to all clients with io.emit() is used to send data to all connected clients
    io.emit("getOnlineUsers", Object.keys(onlineUsers));
    socket.on("disconnect", () => {
        console.log("A new socket user is disconnected", socket.id);
        delete onlineUsers[userId];
        io.emit("getOnlineUsers", Object.keys(onlineUsers));
    });
});
