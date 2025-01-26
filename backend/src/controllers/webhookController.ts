import { Request, Response } from "express";
import { Webhook } from "svix";

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error("Error: Please add SIGNING_SECRET from Clerk Dashboard to .env");
  }

  const wh = new Webhook(SIGNING_SECRET);
  const headers = req.headers;
  const payload = req.body;

  const svixId = headers["svix-id"];
  const svixTimestamp = headers["svix-timestamp"];
  const svixSignature = headers["svix-signature"];

  if (!svixId || !svixTimestamp || !svixSignature) {
    res.status(400).json({
      success: false,
      message: "Error: Missing svix headers",
    });
    return;
  }

  let evt = {} as any;

  try {
    evt = wh.verify(payload, {
      "svix-id": svixId as string,
      "svix-timestamp": svixTimestamp as string,
      "svix-signature": svixSignature as string,
    });
  } catch (err: any) {
    console.error("Error: Could not verify webhook:", err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log("Webhook payload:", evt.data);

  res.status(200).json({
    success: true,
    message: "Webhook received",
  });
};
