import { Router } from "express";
import MessageController from "../controllers/messageController";
import { protectRoute } from "../middlewares/authMiddleware";

const MessageControllerClass = new MessageController();
const router: Router = Router();

router.get("/users", protectRoute, MessageControllerClass.getUsersForSidebar);
router.get("/:id", protectRoute, MessageControllerClass.getMessages);
router.post("/send/:id", protectRoute, MessageControllerClass.sendMessage);

//group message routes
router.get("/group/:id", protectRoute, MessageControllerClass.getGroupMessages);
router.post("/group/send/:id", protectRoute, MessageControllerClass.sendGroupMessage);
router.post("/group", protectRoute, MessageControllerClass.createGroup);
router.get("/user/groups", protectRoute, MessageControllerClass.getGroupsForSidebar);

export default router;