import jwt from "jsonwebtoken";
import { Response } from "express";
import { Types } from "mongoose";

interface userProps {
    userId: Types.ObjectId;
    res: Response;
}

export const generateToken = ({ userId, res }: userProps): string => {

    const secret = process.env.JWT_SECRET;

    if (!secret) throw new Error("JWT secret key is not defined in environment variables.");
    try {
        const token = jwt.sign({ userId }, secret, {
            expiresIn: "7d"
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development"
        });

        return token;

    } catch (error) {
        console.error("Error while generating token: ", error);
        throw new Error("Failed to generate token");
    }

};