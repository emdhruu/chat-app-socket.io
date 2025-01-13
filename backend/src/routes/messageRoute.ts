import { Router } from "express";
import MessageController from "../controllers/messageController";
import { protectRoute } from "../middlewares/authMiddleware";

const MessageControllerClass = new MessageController();
const router: Router = Router();

router.get("/users", protectRoute, MessageControllerClass.getUsersForSidebar);
router.get("/:id", protectRoute, MessageControllerClass.getMessages);
router.post("/send/:id", protectRoute, MessageControllerClass.sendMessage);

export default router;