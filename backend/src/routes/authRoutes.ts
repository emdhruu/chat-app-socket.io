import { Router } from "express";
import AuthController from "../controllers/authController";
import { protectRoute } from "../middlewares/authMiddleware";
const router: Router = Router();

const AuthControllerClass = new AuthController();

router.post("/login", AuthControllerClass.login);

router.post("/signup", AuthControllerClass.signUp);

router.post("/logout", AuthControllerClass.logout);

router.put("/update-profile", protectRoute, AuthControllerClass.updateProfile);

router.get("/check", protectRoute, AuthControllerClass.checkAuth);

export default router;