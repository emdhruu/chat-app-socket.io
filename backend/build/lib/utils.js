"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = ({ userId, res }) => {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error("JWT secret key is not defined in environment variables.");
    try {
        const token = jsonwebtoken_1.default.sign({ userId }, secret, {
            expiresIn: "7d"
        });
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.MODE !== "development"
        });
        return token;
    }
    catch (error) {
        console.error("Error while generating token: ", error);
        throw new Error("Failed to generate token");
    }
};
exports.generateToken = generateToken;
