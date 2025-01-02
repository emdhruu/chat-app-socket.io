import { Router } from "express";
import UserController from "../controllers/authController";
const router: Router = Router();

const UserControllerClass = new UserController();

router.get("/login", (req, res) => {
    res.send("hey you are welcome to this applicaation");
});

router.get("/signup", UserControllerClass.signUp);

export default router;