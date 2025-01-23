import { Router } from "express";
import UserController from "../controllers/userController";
import { protectRoute } from "../middlewares/authMiddleware";

const UserControllerClass = new UserController();

const router: Router = Router();

router.get("/friends", protectRoute, UserControllerClass.getFriends);
router.get("/blockUsers", protectRoute, UserControllerClass.getBlockUsers);
router.post("/removeFriend/:userId", protectRoute, UserControllerClass.removeFriend);
router.post("/block/:userId", protectRoute, UserControllerClass.blockUser);
router.post("/unblock/:userId", protectRoute, UserControllerClass.unblockUser);

//requests
router.post("/sendRequest/:friendId", protectRoute, UserControllerClass.sendFriendRequest);
router.post("/acceptRequest/:friendId", protectRoute, UserControllerClass.acceptFriendRequest);
router.post("/rejectRequest/:friendId", protectRoute, UserControllerClass.rejectFriendRequest);

router.get("/requests", protectRoute, UserControllerClass.getFriendRequests);
router.get("/requestStatus/:userId", protectRoute, UserControllerClass.requestStatus);

export default router;