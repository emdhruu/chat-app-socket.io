import User from "../models/userModel";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils";
import cloudinary from "../lib/cloudinary";

export default class AuthController {

    signUp = async (req: Request, res: Response): Promise<any> => {
        const { fullName, email, password } = req.body;
        try {
            if (!fullName || !email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }
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
                //generate jwt token
                const userId = newUser._id;
                generateToken({ userId, res });

                await newUser.save();
                res.status(201).json({
                    _id: userId,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic
                });
            } else {
                return res.status(400).json({ message: "Invalid user data" });
            }

        } catch (error) {
            console.log("Error in signup controller", error);

            res.status(500).json({ message: "Internal server error" });
        }
    };

    login = async (req: Request, res: Response): Promise<any> => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: "Incorrect Password" });
            }

            const userId = user.id;
            generateToken({ userId, res });

            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            });

        } catch (error) {
            console.log("Error in login controller", error);

            res.status(500).json({ message: "Internal Server Error." });
        }
    };

    logout = (req: Request, res: Response) => {
        try {
            res.cookie("jwt", "", { maxAge: 0 });
            res.status(200).json({ message: "Logged out Successfully." });

        } catch (error) {
            console.log("Error in logout controllor.", error);

            res.status(500).json({ message: "Internal Server Error." });
        }
    };

    updateProfile = async (req: Request, res: Response): Promise<any> => {
        try {
            const { profilePic } = req.body;
            const userId = req.user._id;

            if (!profilePic) {
                return res.status(400).json({ message: "Profile pic must be provided." });
            }

            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

            res.status(200).json(updatedUser);

        } catch (error) {
            console.log("Error in update profile controller", error);

            res.status(500).json({ message: "Internal server error" });
        }
    };

    checkAuth = (req: Request, res: Response) => {
        try {
            res.status(200).json(req.user);
        } catch (error) {
            console.log("Error in checkAuth controller", error);

            res.status(500).json({ message: "Internal server error" });
        }
    };

} 