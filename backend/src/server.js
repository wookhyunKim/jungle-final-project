const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config(); // .env 파일의 변수를 불러옵니다.

const PORT = process.env.PORT || 3000;
const IP = process.env.IP || "127.0.0.1";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const path = require("path");
const static = require("serve-static");

const roomRouter = require("./routes/roomRoute");
app.use("/room", roomRouter);

const memberRouter = require("./routes/memberRoute");
app.use("/member", memberRouter);

app.get("*", (_, res) => {
    res.status(404).send("404 Not Found");
});

app.listen(PORT, IP, () => {
    console.log("server is running at 3000");
});
