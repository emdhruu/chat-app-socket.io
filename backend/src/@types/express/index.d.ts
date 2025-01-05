import { Request } from "express";
import { Types } from "mongoose";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}