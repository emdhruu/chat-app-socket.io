import mongoose from "mongoose";
import User from "./userModel";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    recevierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        reuired: true
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

export default Message;