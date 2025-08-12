import express from "express";
// import logger and morgan
import logger from "./logger.js";
import morgan from "morgan";


const app = express();
const port = 3000;

app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.get("/", (req, res) => {
    res.send("Hello world");
})

app.post("/login", (req, res) => {
    // instead of console.log we can use this
    // all this information into the console is used to debug a realtime application
    logger.info("this is logger info");
    logger.warn("this is logger warn")
    const {email, password} = req.body;
    res.send(`email is ${email} and password is ${password}`);
})

app.listen(port, () => {
    console.log(`serer is runnning at port: ${port}`);
})