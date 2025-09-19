import express from "express"

const PORT = 3000

const app = express();

app.get("/test", (req, res) => {
    res.send("hello world from dockerized app");
})

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
})