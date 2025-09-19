import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "*"
}));

app.get("/api/hello", (req, res) => {
    return res.status(200).json({
        message: "hello world from docker",
        success: true
    });
})

app.get("/api/test", (req, res) => {
    return res.status(200).json({
        message: "test from docker container",
        success: true
    });
})

export { app };