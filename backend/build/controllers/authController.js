"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_1 = require("../lib/utils");
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
class AuthController {
    constructor() {
        this.signUp = async (req, res) => {
            const { fullName, email, password } = req.body;
            try {
                if (!fullName || !email || !password) {
                    return res.status(400).json({ message: "All fields are required" });
                }
                if (password.length < 6)
                    return res.status(400).json({ message: "Password must be at least 6 characters" });
                const user = await userModel_1.default.findOne({ email });
                if (user)
                    return res.status(400).json({ message: "Email already exits" });
                const salt = await bcryptjs_1.default.genSalt(10);
                const hashedPassword = await bcryptjs_1.default.hash(password, salt);
                const newUser = new userModel_1.default({
                    fullName: fullName,
                    email: email,
                    password: hashedPassword
                });
                if (newUser) {
                    //generate jwt token
                    const userId = newUser._id;
                    (0, utils_1.generateToken)({ userId, res });
                    await newUser.save();
                    res.status(201).json({
                        _id: userId,
                        fullName: newUser.fullName,
                        email: newUser.email,
                        profilePic: newUser.profilePic
                    });
                }
                else {
                    return res.status(400).json({ message: "Invalid user data" });
                }
            }
            catch (error) {
                console.log("Error in signup controller", error);
                res.status(500).json({ message: "Internal server error" });
            }
        };
        this.login = async (req, res) => {
            const { email, password } = req.body;
            try {
                const user = await userModel_1.default.findOne({ email });
                if (!user) {
                    return res.status(400).json({ message: "Invalid credentials" });
                }
                const isPasswordCorrect = await bcryptjs_1.default.compare(password, user.password);
                if (!isPasswordCorrect) {
                    return res.status(400).json({ message: "Incorrect Password" });
                }
                const userId = user.id;
                (0, utils_1.generateToken)({ userId, res });
                res.status(200).json({
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    profilePic: user.profilePic,
                });
            }
            catch (error) {
                console.log("Error in login controller", error);
                res.status(500).json({ message: "Internal Server Error." });
            }
        };
        this.logout = (req, res) => {
            try {
                res.cookie("jwt", "", { maxAge: 0 });
                res.status(200).json({ message: "Logged out Successfully." });
            }
            catch (error) {
                console.log("Error in logout controllor.", error);
                res.status(500).json({ message: "Internal Server Error." });
            }
        };
        this.updateProfile = async (req, res) => {
            try {
                const { profilePic } = req.body;
                const userId = req.user._id;
                if (!profilePic) {
                    return res.status(400).json({ message: "Profile pic must be provided." });
                }
                const uploadResponse = await cloudinary_1.default.uploader.upload(profilePic);
                const updatedUser = await userModel_1.default.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });
                res.status(200).json(updatedUser);
            }
            catch (error) {
                console.log("Error in update profile controller", error);
                res.status(500).json({ message: "Internal server error" });
            }
        };
        this.checkAuth = (req, res) => {
            try {
                res.status(200).json(req.user);
            }
            catch (error) {
                console.log("Error in checkAuth controller", error);
                res.status(500).json({ message: "Internal server error" });
            }
        };
    }
}
exports.default = AuthController;
