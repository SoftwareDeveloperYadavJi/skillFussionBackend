import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
    const token = req.query.token || req.headers.authorization?.split(" ")[1];
    console.log("Token:", token);
    if (!token) {
        return res.status(401).json({ error: "Access denied, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to the request object
        next();
    } catch (err) {
        res.status(403).json({ error: "Invalid or expired token" });
    }
};
