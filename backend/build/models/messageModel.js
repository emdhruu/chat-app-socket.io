"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("./userModel"));
const messageSchema = new mongoose_1.default.Schema({
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: userModel_1.default,
        required: true
    },
    recevierId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: userModel_1.default,
        reuired: true
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    }
}, { timestamps: true });
const Message = mongoose_1.default.model("Message", messageSchema);
exports.default = Message;
