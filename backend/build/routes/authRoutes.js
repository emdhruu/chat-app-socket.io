"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
const AuthControllerClass = new authController_1.default();
router.post("/login", AuthControllerClass.login);
router.post("/signup", AuthControllerClass.signUp);
router.post("/logout", AuthControllerClass.logout);
router.put("/update-profile", authMiddleware_1.protectRoute, AuthControllerClass.updateProfile);
router.get("/check", authMiddleware_1.protectRoute, AuthControllerClass.checkAuth);
exports.default = router;
