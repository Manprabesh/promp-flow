import express from "express";
import { createMessage, saveMessage, getMessage } from "../controllers/message.controller.js";
import authenticate from "../middleware/auth.js";
const messageRouter = express.Router();

messageRouter.post("/ask-ai", authenticate, createMessage);
messageRouter.post("/save-message", authenticate, saveMessage);
messageRouter.get("/get-message", authenticate, getMessage);

export default messageRouter;