import mongoose from "mongoose";
import User from "./userModel";

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            required: true,
        }
    ],
    groupImage: {
        type: String,
        default: "",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    }
}, { timestamps: true });

const Group = mongoose.model("Group", groupSchema);

export default Group;