import express from "express";
import session from "express-session";
import passport from "passport";
import userRoutes from "../routes/user.routes.js";
import "./auth.js"; // Initialize passport

const app = express();

// Session handling
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", userRoutes);

export default app;
