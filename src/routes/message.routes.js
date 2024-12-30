import express from "express";
import { messageController } from "../controllers/message.Controller.js";

const router = express.Router();

// Get conversation between two users
router.get("/conversation/:userId/:otherUserId", messageController.getConversation);

// Get all conversations for a user
router.get("/conversations/:userId", messageController.getUserConversations);

export default router;