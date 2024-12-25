import * as userService from "../services/user.service.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


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

export const completeProfile = async (req, res)=>{
    try {
        const userId = req.params.id;
        const { mobileNumber, gender, city, state, country, dob, phone, language, preferredLanguage } = req.body;
        
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                mobileNumber,
                gender,
                city,
                state,
                country,
                dob,
                phone,
                language,
                preferredLanguage,
            },
        });
        res.status(200).json({ message: "Profile updated successfully." });

    } catch (error) {

        console.error("Error updating profile in Controller:", error);
        res.status(500).json({ error: "An error occurred while updating the profile" });
        
    }
}
