import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import passport from "./utils/auth.js";
import session from "express-session";

const app = express();

// Middleware for session management
app.use(
    session({
        secret: process.env.SESSION_SECRET, // Replace with a strong secret
        resave: false, // Don't save session if unmodified
        saveUninitialized: true, // Save uninitialized session
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Home Route
app.get("/", (req, res) => {
    res.send(
        req.user
            ? `<h1>Welcome, ${req.user.name}</h1><img src="${req.user.avatar}" /><a href="/logout">Logout</a>`
            : '<a href="/auth/google">Login with Google</a>'
    );
});

// Google OAuth Routes
app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        res.redirect("/");
    }
);

// Logout Route
app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy(() => {
            res.redirect("/");
        });
    });
});

app.use(express.json());
app.use(cors());



// test route
app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;