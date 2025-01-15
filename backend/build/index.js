"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./lib/db");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const socket_1 = require("./lib/socket");
const path_1 = __importDefault(require("path"));
const FRONTEND_PATH = path_1.default.join(__dirname, "../../frontend/dist");
dotenv_1.default.config();
const PORT = process.env.PORT;
socket_1.app.use(express_1.default.json());
socket_1.app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
socket_1.app.use((0, cookie_parser_1.default)());
socket_1.app.use((0, cors_1.default)({
    origin: process.env.MODE === "development" ? ["http://localhost:5173"] : "*",
    credentials: true
}));
socket_1.app.use("/api", routes_1.default);
if (process.env.MODE === "production") {
    socket_1.app.use(express_1.default.static(FRONTEND_PATH));
    socket_1.app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(FRONTEND_PATH, "index.html"));
    });
}
socket_1.server.listen(PORT || 4000, () => {
    console.log(`Server is running at PORT http://localhost:${PORT}`);
    (0, db_1.connectDB)();
});
