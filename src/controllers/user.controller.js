import { secretmanager } from "googleapis/build/src/apis/secretmanager/index.js";
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
        const { id } = req.user;
        const { subject, body, email, skill } = req.body;
        // if (!req.isAuthenticated()) return res.redirect("/auth/google");
        console.log("User:", req.user);
        const user = await prisma.user.findUnique({
            where: { id },
        });
        const otherUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!otherUser) {
            return res.status(404).json({ error: `User with email ${email} not found.` });
        }

        if (!user) {
            return res.status(404).json({ error: `User with id ${id} not found.` });
        }
        console.log("user", user); 
        const meetingLink = await userService.createGoogleMeeting(user, email, subject, body);
        console.log("meetingLink", meetingLink);
        const meeting = await prisma.meeting.create({
            data: {
                userId: req.user.id,
                googleCalendarId: meetingLink.hangoutLink,
                secondUserId: otherUser.id,
                body: body,
                skill: skill,
                meetingLink: meetingLink.meetingLink,
                startTime: new Date(),
                endTime: new Date(new Date().getTime() + 30 * 60000),
            },
        });

        res.status(200).json({ "message": "Google Meet created successfully.", meeting });
    } catch (error) {
        console.error("Error creating meeting in Controller:", error);
        res.status(500).send("Error creating Google Meet.");
    }
};

export const completeProfile = async (req, res)=>{
    try {
       
        const { id } = req.user;
        // const id  = "cm53ojiix0000ffmszuq27s93";
       
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
        console.log("req.user", req.user.id);
        const { id } = req.user;
        // const id = "cm53ojiix0000ffmszuq27s93";
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
    const { id } = req.user; // Replace this with dynamic userId (e.g., from req.user)
    const { github, linkedin, twitter, website } = req.body;

    try {
        // Check if social media links exist for the user
        const existingSocialMedia = await prisma.socialMedia.findUnique({
            where: { userId: id },
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
    const { id } = req.user; // Replace this with dynamic userId (e.g., from req.user)

    try {
        const socialMedia = await prisma.socialMedia.findUnique({
            where: { userId : id },
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
    const { id } = req.user; // Replace this with dynamic userId (e.g., from req.user)
    const { educations } = req.body;

    try {
        // Check if userId exists
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return res.status(404).json({ error: `User with id ${userId} not found.` });
        }

        // Prepare the data for insertion
        const educationData = educations.map((education) => ({
            userId: id,
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

    const { id } = req.user; // Replace this with dynamic userId (e.g., from req.user)
    const user = await prisma.user.findUnique({
        where: { id },
    });
    if(!user){
        return res.status(404).json({ error: `User with id ${id} not found.` });
    }
    console.log("user", user);
    try {
        const education = await prisma.education.findMany({
            where: { userId: id },
        });
        res.status(200).json(education);
    } catch (error) {
        console.error('Error getting education details:', error);
        res.status(500).json({ error: 'An error occurred while getting education details.' });
    }
}

// Update user skill exchanges

export const updateSkillExchanges = async (req, res) => {
    const { id } = req.user; // Dynamic userId from req.user
    const { offeredSkill, requestedSkill } = req.body;

    try {
        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return res.status(404).json({ error: `User with id ${id} not found.` });
        }

        // Use findFirst to find the first SkillExchange record for the user
        let skillExchange = await prisma.skillExchange.findFirst({
            where: { userId: id }, // Using findFirst instead of findUnique
        });

        if (skillExchange) {
            // Update the existing skill exchange record using its unique id
            skillExchange = await prisma.skillExchange.update({
                where: { id: skillExchange.id },  // Use the unique id of the existing record
                data: {
                    offeredSkill,
                    requestedSkill,
                },
            });
        } else {
            // Create a new skill exchange record
            skillExchange = await prisma.skillExchange.create({
                data: {
                    userId: id,
                    offeredSkill,
                    requestedSkill,
                },
            });
        }

        return res.status(200).json({
            message: "Skill exchanges processed successfully.",
            skillExchange,
        });
    } catch (error) {
        console.error("Error processing skill exchanges:", error);
        res.status(500).json({
            error: "An error occurred while processing skill exchanges.",
        });
    }
};





// Get user skill exchanges
export const getSkillExchanges = async (req, res) => {
    const { id: userId } = req.user; // Replace this with dynamic userId (e.g., from req.user)
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
                role: true,
                skillExchanges: {
                    select: {
                        offeredSkill: true,
                    },
                },
            },
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'An error occurred while getting users.' });
    }
};

// Get all meetings
export const getMeetings = async (req, res) => {
    try {
        const { id } = req.user; // Extract user ID from the request
        const meetings = await prisma.meeting.findMany({
            where: {
                OR: [
                    { userId: id },
                    { secondUserId: id },
                ],
            },
            include: {
                secondaryUser: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                }, // Adjust based on desired fields
            },
        });

        res.status(200).json(meetings);
    } catch (error) {
        console.error('Error getting meetings:', error);
        res.status(500).json({ error: 'An error occurred while fetching meetings.' });
    }
};


export const  getUserId = async (req, res) => {
    try {
        const { id } = req.user;
        res.status(200).json({ userId: id });
    } catch (error) {
        console.error('Error getting user id:', error);
        res.status(500).json({ error: 'An error occurred while getting user id.' });
    }
};



export const getConversionBetweenTwoUsers = async (req, res) => {
    const { userId, otherUserId } = req.params;

    try {
        // Fetch conversation based on participants
        const conversation = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: { id: userId },
                    some: { id: otherUserId }
                }
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    },
                    select: {
                        id: true,
                        content: true,
                        senderId: true,
                        receiverId: true,
                        createdAt: true
                    }
                },
            },
        });

        if (conversation.length === 0) {
            return res.status(404).json({ message: 'Conversation not found.' });
        }

        res.status(200).json(conversation[0].messages); // Return messages of the first conversation
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}


export const sendNewMessage = async (req, res) => {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        // Check if a conversation already exists between sender and receiver
        let conversation = await prisma.conversation.findFirst({
            where: {
                participants: {
                    some: { id: senderId },
                    some: { id: receiverId }
                }
            }
        });

        // If no conversation exists, create a new conversation
        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participants: {
                        connect: [
                            { id: senderId },
                            { id: receiverId }
                        ]
                    }
                }
            });
        }

        // Create the message in the conversation
        const newMessage = await prisma.message.create({
            data: {
                content,
                senderId,
                receiverId,
                conversationId: conversation.id,
            }
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

