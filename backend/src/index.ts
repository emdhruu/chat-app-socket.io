import express, { Request, Response } from "express";
import router from "./routes/routes";
import dotenv from "dotenv";
import { connectDB } from "./lib/db";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/api", router);

app.listen(PORT || 4000, () => {
    console.log(`Server is running at PORT http://localhost:${PORT}`);
    connectDB();
});