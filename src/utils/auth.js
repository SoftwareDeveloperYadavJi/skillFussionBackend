import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                let user = await prisma.user.findUnique({ where: { googleId: profile.id } });

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            googleId: profile.id,
                            email: profile.emails[0].value,
                            name: profile.displayName,
                            avatar: profile.photos[0]?.value || null,
                        },
                    });
                }

                // Create a JWT token
                const token = jwt.sign(
                    { id: user.id, email: user.email }, // Payload
                    process.env.JWT_SECRET, // Secret key
                    { expiresIn: "1h" } // Token expiration
                );

                // Pass the token and user data
                return done(null, { user, token });
            } catch (error) {
                console.error("Error in Google Strategy:", error.message);
                return done(error, null);
            }
        }
    )
);
