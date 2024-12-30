import express from "express";
import session from "express-session";
import passport from "passport";
import userRoutes from "../routes/user.routes.js";
import cors from "cors";
import connectionRoutes from "../routes/connection.routes.js";
import "./auth.js"; // Initialize passport
import reviewsRoutes from "../routes/review.routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// CORS
app.use(
    cors({
        origin: 'http://localhost:8080', // Replace with your frontend URL
        credentials: true, // Allow cookies and credentials
    })
);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080'); // Add frontend domain here
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});



// Session handling
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Use secure cookies in production
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
    })
);





app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/hello", (req, res) => {
    res.send("Hello World!");
});





app.use("/", userRoutes);

app.use("/api/connection", connectionRoutes);
app.use("/api/review", reviewsRoutes);

export default app;
