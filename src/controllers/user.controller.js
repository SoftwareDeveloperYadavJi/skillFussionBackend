import * as userService from "../services/user.service.js";

export const googleAuth = async (req, res) => {
    try {
        const user = await userService.handleGoogleAuth(req.user);
        res.redirect("/create-meeting");
    } catch (error) {
        console.error("Error in Google Auth Controller:", error);
        res.status(500).send("Authentication failed.");
    }
};

export const createMeeting = async (req, res) => {
    try {
        if (!req.isAuthenticated()) return res.redirect("/auth/google");

        const meetingLink = await userService.createGoogleMeeting(req.user);
        res.send(`Google Meet created successfully. Join it [here](${meetingLink})`);
    } catch (error) {
        console.error("Error creating meeting in Controller:", error);
        res.status(500).send("Error creating Google Meet.");
    }
};
