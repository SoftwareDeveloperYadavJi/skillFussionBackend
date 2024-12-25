import express from "express";
import session from "express-session";
import passport from "passport";
import userRoutes from "../routes/user.routes.js";
import "./auth.js"; // Initialize passport

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session handling
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", userRoutes);

export default app;
