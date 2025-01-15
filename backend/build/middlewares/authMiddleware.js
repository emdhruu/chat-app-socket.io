"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const protectRoute = async (req, res, next) => {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error("JWT secret key is not defined in environment variables.");
    try {
        // console.log("headers", req.headers);
        // console.log("cookies", req.cookies);
        const token = req.cookies.jwt;
        // console.log("token", token);
        if (!token) {
            res.status(400).json({ message: "Unauthorized - No Token Provided" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (!decoded) {
            res.status(400).json({ message: "Unauthorized - Invalid Token" });
            return;
        }
        // console.log("decoded", decoded);
        const user = await userModel_1.default.findById(decoded.userId).select("-password");
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        // console.log("User", user);
        req.user = user;
        next();
    }
    catch (error) {
        console.log("Error in auth middleware", error);
        res.status(500).json({ message: "Unauthorized Access" });
        throw new Error("Internal server error");
    }
};
exports.protectRoute = protectRoute;
