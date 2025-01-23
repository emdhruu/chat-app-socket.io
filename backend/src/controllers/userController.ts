import mongoose from "mongoose";
import { getReceiverSocketId, io } from "../lib/socket";
import User from "../models/userModel";
import { NextFunction, Request, Response } from "express";

export default class UserController {

    removeFriend = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userId } = req.params;
            const myId = req.user._id;

            await User.findByIdAndUpdate(myId, { $pull: { friends: userId } });
            await User.findByIdAndUpdate(userId, { $pull: { friends: myId } });

            const recipientSocketId = getReceiverSocketId(userId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("friendRemoved", { by: myId });
            }

            res.status(200).json({ message: "Friend removed successfully" });

        } catch (error) {
            console.log("Error in remove friend controller", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    blockUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const { userId }: any = req.params;
            const myId = req.user._id;

            const user = await User.findById(myId);
            if (user?.blockUsers.includes(userId)) {
                return res.status(400).json({ message: "User is Already blocked" });
            }
            await User.findByIdAndUpdate(myId, { $push: { blockUsers: userId } });

            res.status(200).json({ message: "User blocked successfully" });

        } catch (error) {
            console.log("Error in block user controller", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    unblockUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const { userId } = req.params;
            const myId = req.user._id;

            await User.findByIdAndUpdate(myId, { $pull: { blockUsers: userId } });

            res.status(200).json({ message: "User unblocked successfully" });

        } catch (error) {
            console.log("Error in unblock user controller", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    getFriends = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const myId = req.user._id;

            const user = await User.findById(myId).populate("friends", "-password");
            res.status(200).json(user?.friends);

        } catch (error) {
            console.log("Error in get friends controller", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    getBlockUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const myId = req.user._id;

            const user = await User.findById(myId).populate("blockUsers", "-password");
            res.status(200).json(user?.blockUsers);

        } catch (error) {
            console.log("Error in get block users controller", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    sendFriendRequest = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const { friendId }: any = req.params;
            const myId = req.user._id;

            if (!mongoose.Types.ObjectId.isValid(friendId)) {
                return res.status(400).json({ message: "Invalid friend Id" });
            }

            const user = await User.findById(myId);
            if (user?.friends.includes(friendId)) {
                return res.status(400).json({ message: "Already friends" });
            }

            if (user?.friendRequests.includes(friendId)) {
                return res.status(400).json({ message: "Friend request already sent" });
            }

            await User.findByIdAndUpdate(friendId, { $push: { friendRequests: myId } });

            // Send notification to friend's socket
            const sender: any = await User.findById(myId).select("fullName  profilePic");
            const recipientSocketId = getReceiverSocketId(friendId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("new-friend-request", { from: myId, name: sender.fullName, profilePic: sender.profilePic });
            }

            res.status(200).json({ message: "Friend request sent successfully" });

        } catch (error) {
            console.log("Error in send friend request controller", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    acceptFriendRequest = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { friendId }: any = req.params;
            const myId = req.user._id;

            // Ensure friendId and myId are valid ObjectIds
            if (!mongoose.Types.ObjectId.isValid(friendId) || !mongoose.Types.ObjectId.isValid(myId)) {
                throw new Error("Invalid user ID");
            }

            const user = await User.findById(myId).session(session);
            if (!user?.friendRequests.includes(friendId)) {
                return res.status(400).json({ message: "Friend request not found" });
            }

            await User.findByIdAndUpdate(myId, { $pull: { friendRequests: friendId }, $push: { friends: friendId } }, { session });
            await User.findByIdAndUpdate(
                friendId,
                { $push: { friends: myId } },
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            //Emit a notification during accepting a friend request
            const senderSocketId = getReceiverSocketId(friendId);
            const recipientSocketId = getReceiverSocketId(myId);

            console.log("sendersocketid is accpt", senderSocketId);
            console.log("recipientsocketid in accpt", recipientSocketId);

            if (senderSocketId) {
                io.to(senderSocketId).emit("friend-request-accepted", { by: myId });
            }
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("friend-request-accepted", { by: friendId });
            }

            res.status(200).json({ message: "Friend request accepted successfully" });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.log("Error in accept friend request controller", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    rejectFriendRequest = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const { friendId }: any = req.params;
            const myId = req.user._id;

            const user = await User.findById(myId);
            if (!user?.friendRequests.includes(friendId)) {
                return res.status(404).json({ message: "No friend requests found" });
            }

            await User.findByIdAndUpdate(myId, { $pull: { friendRequests: friendId } });

            const senderSocketId = getReceiverSocketId(friendId);
            const recipientSocketId = getReceiverSocketId(myId);

            console.log("sendersocketid is reject", senderSocketId);
            console.log("recipientsocketid in reject", recipientSocketId);

            if (senderSocketId) {
                io.to(senderSocketId).emit("friendRequestRejected", { by: myId });
            }
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("friendRequestRejected", { by: friendId });
            }

            res.status(200).json({ message: "Friend request rejected successfully" });
        } catch (error) {
            console.log("Error in reject friend request controller", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    getFriendRequests = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const myId = req.user._id;
            const user = await User.findById(myId).populate("friendRequests", "-password");
            res.status(200).json(user?.friendRequests);
        } catch (error) {
            console.log("Error in get friend requests controller", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

    requestStatus = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const { userId }: any = req.params;
            const myId = req.user._id;

            const user = await User.findById(userId);
            if (user?.friends.includes(myId)) {
                return res.status(200).json({ status: "accepted" });
            }
            if (user?.friendRequests.includes(myId)) {
                return res.status(200).json({ status: "pending" });
            }
            res.status(200).json({ status: "none" });
        } catch (error) {
            console.error("Error fetching friend request status:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    };

}