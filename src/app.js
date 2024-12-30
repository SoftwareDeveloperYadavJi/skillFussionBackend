import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { setupSocketHandlers } from "./controllers/socket.Controller.js";
import userRouter from "./routes/user.routes.js";   
import connectionRouter from "./routes/connection.routes.js";
import reviewRouter from "./routes/review.routes.js";
import messageRouter from "./routes/message.routes.js";


dotenv.config();

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:8080", // Replace with your frontend URL
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// CORS
app.use(
    cors({
        origin: "http://localhost:8080", // Replace with your frontend URL
        credentials: true, // Allow cookies and credentials
    })
);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
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
app.use("/", userRouter);
app.use("/api/connection", connectionRouter);
app.use("/api/review", reviewRouter);
app.use("/api/messages", messageRouter);


// Setup Socket.IO handlers
setupSocketHandlers(io, prisma);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { prisma };