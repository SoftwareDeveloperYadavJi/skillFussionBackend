import express from "express";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());



// test route
app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;