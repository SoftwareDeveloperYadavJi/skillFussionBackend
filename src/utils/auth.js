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
            passReqToCallback: true, // Ensure req is passed
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
                            avatar: profile.photos[0].value,
                            accessToken: accessToken, // Store access token
                            refreshToken: refreshToken, // Store refresh token
                        },
                    });
                } else {
                    // Update tokens if user exists
                    user = await prisma.user.update({
                        where: { googleId: profile.id },
                        data: { accessToken, refreshToken },
                    });
                }

                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    )
);


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
});
