import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profilePic: {
            type: String,
            default: ""
        },
        friends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users",
            }
        ],
        blockUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users",
            }
        ],
        friendRequests: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users",
            }
        ]
    },
    { timestamps: true }
);

const User = mongoose.model("Users", userSchema);

export default User;