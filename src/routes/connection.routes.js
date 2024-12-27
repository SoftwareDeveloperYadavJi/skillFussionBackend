import express from "express";
import passport from "passport";
import * as connectionController from "../controllers/connection.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

// Connection Routers
router.post("/request", connectionController.sendConnetionRequest);
router.post("/accept",  connectionController.acceptConnectionRequest);
router.post("/reject", connectionController.rejectConnectionRequest);
router.get("/connected", connectionController.getAcceptedConnections);
router.get("/requests", connectionController.getConnectionRequests);

export default router;