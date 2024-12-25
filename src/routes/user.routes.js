import express from "express";
import passport from "passport";
import * as userController from "../controllers/user.controller.js";

const router = express.Router();

router.get("/auth/google", passport.authenticate("google", {
    scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/calendar.events",
    ],
    accessType: "offline",
    prompt: "consent",
}));

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    userController.googleAuth
);

router.get("/create-meeting", userController.createMeeting);

export default router;
