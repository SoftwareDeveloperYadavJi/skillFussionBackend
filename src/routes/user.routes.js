import express from "express";
import passport from "passport";
import * as userController from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

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


// User Routers
router.post("/api/complete-profile", userController.completeProfile);
router.get("/create-meeting", isAuthenticated, userController.createMeeting);
router.get("/api/user",isAuthenticated, userController.getUserPorfile);
router.post("/api/update/socialmedia", userController.updateSocialMediaLinks);
router.get("/api/user/socialmedia", userController.getSocialMediaLinks);
router.post("/api/update/education", userController.updateEducation);
router.get("/api/user/education", userController.getEducation);
router.post("/api/update/skillexchange", userController.updateSkillExchanges);
// router.get("/api/user/potentialmatches", userController.getPotentialMatches);
router.get("/api/users", userController.getAllUsers);

export default router;
