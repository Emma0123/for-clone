require("dotenv").config()
const PORT=process.env.PORT||2000;
const express = require("express");
const app = express ();
const cors = require("cors")
const bearerToken = require("express-bearer-token");
const { redisConnect } = require("./helper/redis"); // import function connect

// redisConnect(); // start connection redis
app.use(cors());
app.use(express.json());
app.use(bearerToken());

app.get("/", (req, res) => {
    return res.status(200).send('API Running');
});

// #define ROUTER
const {usersRouter, tweetsRouter } = require("./routers");
app.use("/account", usersRouter);
app.use("/tweet", tweetsRouter);

app.use("/public", express.static("public"));

// #error handling express (tulis di bawahnya define router)
app.use((error, req, res, next) => {
    console.log(error);
    return res.status(error.rc || 500).send(error)
})

app.listen(PORT, () => {
    console.log("API RUNNING", PORT);
});