import User from "../models/userModel";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

export default class UserController {

    signUp = async (req: Request, res: Response): Promise<any> => {
        const { fullName, email, password } = req.body;
        try {
            if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

            const user = await User.findOne({ email });

            if (user) return res.status(400).json({ message: "Email already exits" });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                fullName: fullName,
                email: email,
                password: hashedPassword
            });

            if (newUser) {
                return res.status(400).json({ message: "Invalid user data" });
            } else {
                //generate jwt token
                
            }

        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };
} 