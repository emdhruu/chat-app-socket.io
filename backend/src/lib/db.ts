import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const mongodbURI = process.env.MONGODB_URI || "MONGODB-URI is not defined in environment variable file.";
        const connect = await mongoose.connect(mongodbURI);
        console.log(`MongoDB connected: ${connect.connection.host}`);

    } catch (error) {
        console.log("Error occuied while connecting db", error);
    }
};