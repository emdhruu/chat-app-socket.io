"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messageController_1 = __importDefault(require("../controllers/messageController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const MessageControllerClass = new messageController_1.default();
const router = (0, express_1.Router)();
router.get("/users", authMiddleware_1.protectRoute, MessageControllerClass.getUsersForSidebar);
router.get("/:id", authMiddleware_1.protectRoute, MessageControllerClass.getMessages);
router.post("/send/:id", authMiddleware_1.protectRoute, MessageControllerClass.sendMessage);
exports.default = router;
