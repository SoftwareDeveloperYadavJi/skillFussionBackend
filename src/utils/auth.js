import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:4000/auth/google/callback", // Redirect URI in Google Console
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if the user already exists
                let user = await prisma.user.findUnique({
                    where: { googleId: profile.id },
                });

                // If not, create a new user
                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            googleId: profile.id,
                            email: profile.emails[0].value,
                            name: profile.displayName,
                            avatar: profile.photos[0].value,
                        },
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
