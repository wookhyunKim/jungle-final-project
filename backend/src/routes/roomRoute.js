const express = require("express");
const router = express.Router();

router.get("/", board_controller.say);

module.exports = router;
