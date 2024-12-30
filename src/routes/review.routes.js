import express from "express";
import * as reviewController from "../controllers/review.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/update",  reviewController.createReview);
router.get("/get",  reviewController.getReviews);

export default router;