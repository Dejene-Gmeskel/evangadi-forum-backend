const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { postAnswer, getAnswer } = require("../controller/answerController");

router.post("/postanswer/:id", authMiddleware, postAnswer);

router.get("/allanswers/:id", authMiddleware, getAnswer);

module.exports = router;
