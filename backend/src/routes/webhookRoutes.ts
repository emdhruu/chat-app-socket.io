import express from "express";
import { handleWebhook } from "../controllers/webhookController";
import bodyParser from "body-parser";

const router = express.Router();

router.post(
  "/webhooks",
  bodyParser.raw({ type: "application/json" }),
  handleWebhook
);

export default router;
    