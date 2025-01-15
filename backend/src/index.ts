import express from "express";
import router from "./routes/routes";
import dotenv from "dotenv";
import { connectDB } from "./lib/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket";
import bodyParser from "body-parser";
import path from "path";
import { Request, Response } from "express";

const FRONTEND_PATH = path.join(__dirname, "../../frontend/dist");

dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.MODE === "development" ? "*" : ["http://localhost:5173"],
    credentials: true
}));

app.use("/api", router);

if (process.env.MODE === "production") {
    app.use(express.static(FRONTEND_PATH));
    app.get("*", (req: Request, res: Response) => {
        res.sendFile(path.join(FRONTEND_PATH, "index.html"));
    });
}


server.listen(PORT || 4000, () => {
    console.log(`Server is running at PORT http://localhost:${PORT}`);
    connectDB();
});