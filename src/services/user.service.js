import { google } from "googleapis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const handleGoogleAuth = async (user) => {
    try {
        let existingUser = await prisma.user.findUnique({
            where: { googleId: user.googleId },
        });

        if (!existingUser) {
            existingUser = await prisma.user.create({
                data: {
                    googleId: user.googleId,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar,
                },
            });
        }

        return existingUser;
    } catch (error) {
        throw new Error("Error handling Google authentication.");
    }
};



export const createGoogleMeeting = async (user, email, subject, body) => {
    const { accessToken, refreshToken } = user;

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_CALLBACK_URL
    );

    oauth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
        summary: subject,
        description: body,
        start: {
            dateTime: new Date().toISOString(),
            timeZone: "America/Los_Angeles",
        },
        end: {
            dateTime: new Date(new Date().getTime() + 30 * 60000).toISOString(),
            timeZone: "America/Los_Angeles",
        },
        attendees: [
            { email: email, optional: true },
          
        ],
        conferenceData: {
            createRequest: {
                requestId: `meet-${Date.now()}`,
                conferenceSolutionKey: { type: "hangoutsMeet" },
            },
        },
    };

    const response = await calendar.events.insert({
        calendarId: "primary",
        resource: event,
        conferenceDataVersion: 1,
    });

    return {
        hangoutLink: response.data.htmlLink,
        meetingLink: response.data.hangoutLink,
    };
};

