import express from "express";
import AuthRoutes from "./authRoutes";
import MessageRoutes from "./messageRoute";
import UserRoutes from "./userRoutes";
import WebhookRoutes from "./webhookRoutes";

const router = express.Router();

router.use("/auth", AuthRoutes);
router.use("/messages", MessageRoutes);
router.use("/users", UserRoutes);
router.use("/webhooks", WebhookRoutes);

export default router;
