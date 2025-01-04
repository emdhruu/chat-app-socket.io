import express from "express";
import router from "./routes/routes";
import dotenv from "dotenv";
import { connectDB } from "./lib/db";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

app.listen(PORT || 4000, () => {
    console.log(`Server is running at PORT http://localhost:${PORT}`);
    connectDB();
});