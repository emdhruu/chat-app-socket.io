import express from "express";
import AuthRoutes from "./authRoutes";
import MessageRoutes from "./messageRoute";

const router = express.Router();

router.use("/auth", AuthRoutes);
router.use("/message", MessageRoutes);

export default router;