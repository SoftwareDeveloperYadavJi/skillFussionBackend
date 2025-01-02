import express from "express";
import passport from "passport";
import * as connectionController from "../controllers/connection.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

// Connection Routers
router.post("/request", connectionController.sendConnetionRequest);
router.post("/accept",isAuthenticated, connectionController.acceptConnectionRequest);
router.post("/reject", connectionController.rejectConnectionRequest);
router.get("/connected",isAuthenticated, connectionController.getAcceptedConnections);
router.get("/requests" ,isAuthenticated, connectionController.getConnectionRequests);

export default router;