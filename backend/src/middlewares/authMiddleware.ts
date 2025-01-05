import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { Request, Response, NextFunction } from "express";

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) throw new Error("JWT secret key is not defined in environment variables.");

    try {
        const token = req.cookies.jwt;

        if (!token) {
            res.status(400).json({ message: "Unauthorized - No Token Provided" });
        }
        const decoded = jwt.verify(token, secret) as any;

        if (!decoded) {
            res.status(400).json({ message: "Unauthorized - Invalid Token" });
        }
        console.log("decoded", decoded);

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            res.status(400).json({ message: "User not found" });
        }
        console.log("User", user);

        req.user = user;

        next();

    } catch (error) {
        console.log("Error in auth middleware", error);
        res.status(500).json({ message: "Unauthorized Access" });
        throw new Error("Internal server error");
    }
};  