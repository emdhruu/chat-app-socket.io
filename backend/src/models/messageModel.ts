import mongoose from "mongoose";
import User from "./userModel";
import Group from "./groupModel";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    recevierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: false
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Group,
        required: false
    },
    text: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        default: "",
    }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

export default Message;