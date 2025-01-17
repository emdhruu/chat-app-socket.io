import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import Message from "../models/messageModel";
import cloudinary from "../lib/cloudinary";
import { getReceiverSocketId, io } from "../lib/socket";
import Group from "../models/groupModel";

export default class MessageController {

    getUsersForSidebar = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const loggedInUser = req.user._id;

            const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password");

            res.status(200).json(filteredUsers);

        } catch (error) {
            console.log("Error in usersForSidebar controller", error);

            res.status(500).json({ message: "Internal server error" });
        }
    };

    getMessages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id: userToChat } = req.params;
            const myId = req.user._id;

            const message = await Message.find({
                $or: [
                    { senderId: myId, recevierId: userToChat },
                    { senderId: userToChat, recevierId: myId }
                ]
            });

            // console.log("Message", message);

            res.status(200).json(message);

        } catch (error) {
            console.log("Error in getMessages controller", error);

            res.status(500).json({ message: "Internal server error" });
        }
    };

    sendMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const senderId = req.user._id;
            const { id: recevierId } = req.params;
            const { text, image } = req.body;

            let imageUrl;
            if (image) {
                // Upload base64 image to cloudinary
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadResponse.secure_url;
            }

            const newMessage = new Message({
                senderId,
                recevierId,
                text,
                image: imageUrl
            });

            await newMessage.save();

            // Emit message to receiver
            const recetverSocketId = getReceiverSocketId(recevierId);
            if (recetverSocketId) {
                io.to(recetverSocketId).emit("newMessage", newMessage);
            }

            res.status(201).json(newMessage);

        } catch (error) {
            console.log("Error in sendMessage controller", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    //Create a new group
    createGroup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { groupName, members, groupImage, description } = req.body;
            const loggedInUser = req.user._id;

            let imageUrl;
            if (groupImage) {
                // Upload base64 image to cloudinary
                const uploadResponse = await cloudinary.uploader.upload(groupImage);
                imageUrl = uploadResponse.secure_url;
            }

            const newGroup = new Group({
                groupName, description, members: [...members, loggedInUser], createdBy: loggedInUser,
                groupImage: imageUrl
            });

            await newGroup.save();
            res.status(201).json(newGroup);

            //todo: Emit message to all members
        } catch (error) {
            console.error("Error in createGroup controllers", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    //Get messages for a group 
    getGroupMessages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id: groupId } = req.params;

            const messages = await Message.find({ groupId }).populate("senderId", "-password");
            res.status(200).json(messages);
        } catch (error) {
            console.error("Error in getGroupMessages controllers", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    //Send message to a group
    sendGroupMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const senderId = req.user._id;
            const { id: groupId } = req.params;
            const { text, image } = req.body;

            let imageUrl;
            if (image) {
                // Upload base64 image to cloudinary
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadResponse.secure_url;
            }
            const newMessage = new Message({ senderId, groupId, text, image: imageUrl });
            await newMessage.save();

            // Emit message to all members
            const group = await Group.findById(groupId).populate("members");
            if (group) {
                group.members.forEach((members: any) => {
                    const memberSocketId = getReceiverSocketId(members._id);
                    if (memberSocketId) {
                        io.to(memberSocketId).emit("newGroupMessage", newMessage);
                    }
                });
            }

            res.status(201).json(newMessage);

        } catch (error) {
            console.error("Error in sendGroupMessage controller", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

}