const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const path = require("path");
const static = require("serve-static");

app.get("*", (_, res) => {
    res.status(404).send("404 Not Found");
});

app.listen(3000, () => {
    console.log("server is running at 3000");
});
