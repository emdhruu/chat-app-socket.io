"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongodbURI = process.env.MONGODB_URI || "MONGODB-URI is not defined in environment variable file.";
        const connect = await mongoose_1.default.connect(mongodbURI);
        console.log(`MongoDB connected: ${connect.connection.host}`);
    }
    catch (error) {
        console.log("Error occuied while connecting db", error);
    }
};
exports.connectDB = connectDB;
