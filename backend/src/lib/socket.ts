import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.MODE === "development" ? ["http://localhost:5173"]: "*",
        credentials: true
    }
});
// function to get receiver socket id
export const getReceiverSocketId = (receiverId: string) => {
    return onlineUsers[receiverId];
};

//used to store online users
const onlineUsers: any = {};

io.on("connection", (socket) => {
    console.log("A new socket user connected", socket.id);

    const userId: any = socket.handshake.query.userId;
    console.log(`User is connected with id ${userId} with ${socket.id}`);

    if (userId) onlineUsers[userId] = socket.id;

    //send online users to all clients with io.emit() is used to send data to all connected clients
    io.emit("getOnlineUsers", Object.keys(onlineUsers));

    socket.on("disconnect", () => {
        console.log("A new socket user is disconnected", socket.id);
        delete onlineUsers[userId];
        io.emit("getOnlineUsers", Object.keys(onlineUsers));
    });

});


export { io, server, app };