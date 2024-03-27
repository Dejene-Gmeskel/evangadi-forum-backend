const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

//questions controllers import
const {
  askQuestion,
  allQuestion,
  singleQuestion,
} = require("../controller/questionController");

//pull all questions
router.get("/allquestions", authMiddleware, allQuestion);

//single question routes
router.get("/singlequestion/:id", authMiddleware, singleQuestion);

//post a question
router.post("/askquestion", authMiddleware, askQuestion);

module.exports = router;
