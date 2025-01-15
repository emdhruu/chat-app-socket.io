"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const messageModel_1 = __importDefault(require("../models/messageModel"));
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const socket_1 = require("../lib/socket");
class MessageController {
    constructor() {
        this.getUsersForSidebar = async (req, res, next) => {
            try {
                const loggedInUser = req.user._id;
                const filteredUsers = await userModel_1.default.find({ _id: { $ne: loggedInUser } }).select("-password");
                res.status(200).json(filteredUsers);
            }
            catch (error) {
                console.log("Error in usersForSidebar controller", error);
                res.status(500).json({ message: "Internal server error" });
            }
        };
        this.getMessages = async (req, res, next) => {
            try {
                const { id: userToChat } = req.params;
                const myId = req.user._id;
                const message = await messageModel_1.default.find({
                    $or: [
                        { senderId: myId, recevierId: userToChat },
                        { senderId: userToChat, recevierId: myId }
                    ]
                });
                // console.log("Message", message);
                res.status(200).json(message);
            }
            catch (error) {
                console.log("Error in getMessages controller", error);
                res.status(500).json({ message: "Internal server error" });
            }
        };
        this.sendMessage = async (req, res, next) => {
            try {
                const senderId = req.user._id;
                const { id: recevierId } = req.params;
                const { text, image } = req.body;
                let imageUrl;
                if (image) {
                    // Upload base64 image to cloudinary
                    const uploadResponse = await cloudinary_1.default.uploader.upload(image);
                    imageUrl = uploadResponse.secure_url;
                }
                const newMessage = new messageModel_1.default({
                    senderId,
                    recevierId,
                    text,
                    image: imageUrl
                });
                await newMessage.save();
                // Emit message to receiver
                const recetverSocketId = (0, socket_1.getReceiverSocketId)(recevierId);
                if (recetverSocketId) {
                    socket_1.io.to(recetverSocketId).emit("newMessage", newMessage);
                }
                res.status(201).json(newMessage);
            }
            catch (error) {
                console.log("Error in sendMessage controller", error);
                res.status(500).json({ message: "Internal server error" });
            }
        };
    }
}
exports.default = MessageController;
