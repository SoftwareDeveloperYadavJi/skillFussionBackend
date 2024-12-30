import * as userService from "../services/user.service.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const googleAuth = async (req, res) => {
    try {
        const user = await userService.handleGoogleAuth(req.user);
        // res.redirect("/create-meeting");
        res.redirect('http://localhost:8080/dashboard'); // Replace with your frontend route
    } catch (error) {
        console.error("Error in Google Auth Controller:", error);
        res.status(500).send("Authentication failed.");
    }
};

export const checkLogin = async (req, res) => {
    
    if (req.isAuthenticated()) { // Assuming `passport` is used
        res.status(200).json({ authenticated: true });
    } else {
        res.status(401).json({ authenticated: false });
    }
};

export const createMeeting = async (req, res) => {
    try {
        // if (!req.isAuthenticated()) return res.redirect("/auth/google");
        console.log("User:", req.user);
        const meetingLink = await userService.createGoogleMeeting(req.user);
        res.send(`Google Meet created successfully. Join it [here](${meetingLink})`);
    } catch (error) {
        console.error("Error creating meeting in Controller:", error);
        res.status(500).send("Error creating Google Meet.");
    }
};

export const completeProfile = async (req, res)=>{
    try {
       
        // const { id } = req.user? : "cm53ojiix0000ffmszuq27s93";
        const id  = "cm53ojiix0000ffmszuq27s93";
       
        const { mobileNumber, about, gender, city, state, country, dob, phone, language, preferredLanguage } = req.body;
        if (!mobileNumber || !about || !gender || !city || !state   || !phone || !language || !preferredLanguage) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }
        
        const user = await prisma.user.update({
            where: { id: id },
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
                about,
            },
        });
        res.status(200).json({ message: "Profile updated successfully." });

    } catch (error) {

        console.error("Error updating profile in Controller:", error);
        res.status(500).json({ error: "An error occurred while updating the profile" });
        
    }
}


// Get User Profile
export const getUserPorfile = async (req, res)=>{
    try {
        // const { id } = req.user;
        const id = "cm53ojiix0000ffmszuq27s93";
        const user = await prisma.user.findUnique({
            where: { id: id },
            
        });
        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getting user profile in Controller:", error);
        res.status(500).json({ error: "An error occurred while getting the profile" });
    }
}


// update user social media links
export const updateSocialMediaLinks = async (req, res) => {
    const userId = "cm53ojiix0000ffmszuq27s93"; // Replace this with dynamic userId (e.g., from req.user)
    const { github, linkedin, twitter, website } = req.body;

    try {
        // Check if social media links exist for the user
        const existingSocialMedia = await prisma.socialMedia.findUnique({
            where: { userId },
        });

        let socialMedia;
        if (existingSocialMedia) {
            // Update the existing record
            socialMedia = await prisma.socialMedia.update({
                where: { userId },
                data: { github, linkedin, twitter, website },
            });
        } else {
            // Create a new record
            socialMedia = await prisma.socialMedia.create({
                data: { userId, github, linkedin, twitter, website },
            });
        }

        res.status(200).json({
            message: "Social media links saved successfully.",
            socialMedia,
        });
    } catch (error) {
        console.error("Error saving social media links:", error);
        res.status(500).json({
            error: "An error occurred while saving the social media links.",
        });
    }
};




// get user social media links
export const getSocialMediaLinks = async (req, res) => {
    const userId = "cm53ojiix0000ffmszuq27s93"; // Replace this with dynamic userId (e.g., from req.user)
    try {
        const socialMedia = await prisma.socialMedia.findUnique({
            where: { userId },
        });
        res.status(200).json(socialMedia);
    } catch (error) {
        console.error("Error getting social media links:", error);
        res.status(500).json({
            error: "An error occurred while getting the social media links.",
        });
    }
};






// update user education
export const updateEducation = async (req, res) => {
    const { userId, educations } = req.body;

    try {
        // Check if userId exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: `User with id ${userId} not found.` });
        }

        // Prepare the data for insertion
        const educationData = educations.map((education) => ({
            userId,
            institute: education.institute,
            degree: education.degree,
            fieldOfStudy: education.fieldOfStudy,
            startDate: new Date(education.startDate),
            endDate: education.endDate ? new Date(education.endDate) : null,
        }));

        // Insert multiple education records
        await prisma.education.createMany({
            data: educationData,
        });

        res.status(201).json({ message: 'Education details added successfully.' });
    } catch (error) {
        console.error('Error inserting education details:', error);
        res.status(500).json({ error: 'An error occurred while adding education details.' });
    }
}


// Get user education
export const getEducation = async (req, res) => {
    const { userId } = "cm53ojiix0000ffmszuq27s93"; // Replace this with dynamic userId (e.g., from req.user)
    try {
        const education = await prisma.education.findMany({
            where: { userId },
        });
        res.status(200).json(education);
    } catch (error) {
        console.error('Error getting education details:', error);
        res.status(500).json({ error: 'An error occurred while getting education details.' });
    }
}

// Update user skill exchanges
export const updateSkillExchanges = async (req, res) => {
    console.log("req.body", req.body);
    const { userId, offeredSkill, requestedSkill } = req.body;
    try {
        // Check if userId exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ error: `User with id ${userId} not found.` });
        }
        const  skillExchanges = await prisma.skillExchange.findUnique({
            where: { userId },
        });
        if(skillExchanges){
            const skillExchangeData = await prisma.skillExchange.update({
                where: { userId },
                data: {
                    offeredSkill,
                    requestedSkill
                },
            });
            res.status(201).json({ message: 'Skill exchanges updated successfully.' , skillExchangeData});
        }else{
            const skillExchangeData = await prisma.skillExchange.create({
                data: {
                    userId,
                    offeredSkill,
                    requestedSkill
                },
            });
            res.status(201).json({ message: 'Skill exchanges added successfully.' , skillExchangeData});
        }
    } catch (error) {
        console.error('Error inserting skill exchanges:', error);
        res.status(500).json({ error: 'An error occurred while adding skill exchanges.' });
    }
};

// Get user skill exchanges
export const getSkillExchanges = async (req, res) => {
    const { userId } = "cm53ojiix0000ffmszuq27s93"; // Replace this with dynamic userId (e.g., from req.user)
    try {
        const skillExchanges = await prisma.skillExchange.findMany({
            where: { userId },
        });
        res.status(200).json(skillExchanges);
    } catch (error) {
        console.error('Error getting skill exchanges:', error);
        res.status(500).json({ error: 'An error occurred while getting skill exchanges.' });
    }
}


// get all users to show in the list in user slect only name,email, avatar 
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                city: true,
                about: true,
            },
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'An error occurred while getting users.' });
    }
};


