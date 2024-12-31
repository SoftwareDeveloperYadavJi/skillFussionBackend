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
    passport.authenticate("google", { session: false }),
    (req, res) => {
        const { token } = req.user; // Extract token from user object
        if (!token) {
            return res.redirect("http://localhost:8080/login?error=Token%20Missing");
        }
        res.redirect(`http://localhost:8080/dashboard?token=${token}`);
    }
);







// User Routers
router.get("/api/check-login",isAuthenticated, userController.checkLogin);
router.post("/api/complete-profile",isAuthenticated, userController.completeProfile);
router.get("/create-meeting", isAuthenticated, userController.createMeeting);
router.get("/api/user",isAuthenticated, userController.getUserPorfile);
router.post("/api/update/socialmedia",isAuthenticated, userController.updateSocialMediaLinks);
router.get("/api/user/socialmedia", isAuthenticated,userController.getSocialMediaLinks);
router.post("/api/update/education",isAuthenticated, userController.updateEducation);
router.get("/api/user/education",isAuthenticated, userController.getEducation);
router.post("/api/update/skillexchange", isAuthenticated ,userController.updateSkillExchanges);
router.get("/api/user/skillexchange", isAuthenticated, userController.getSkillExchanges);
// router.get("/api/user/potentialmatches", userController.getPotentialMatches);
router.get("/api/users",isAuthenticated, userController.getAllUsers);

export default router;
