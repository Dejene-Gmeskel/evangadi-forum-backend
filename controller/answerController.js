const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../DB/dbConfig");

// Post answer
async function postAnswer(req, res) {
  const { answer } = req.body;
  const { id } = req.params;
  const { userid } = req.user;

  //console.log("ID:", id);

  if (!answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide your answer" });
  }

  try {
    // Check if the question exists
    const [question] = await dbconnection.query(
      "SELECT questionid FROM questions WHERE id = ?",
      [id]
    );

    if (!question || !question[0] || !question[0].questionid) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question not found" });
    }
    const questionid = question[0].questionid;

    // To Check if the user has already answered the question
    const [existingAnswer] = await dbconnection.query(
      "SELECT answerid FROM answers WHERE userid = ? AND questionid = ?",
      [userid, questionid]
    );

    if (existingAnswer && existingAnswer.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "You have already answered this question" });
    }

    // If the answer is new, insert it into the database
    await dbconnection.query(
      "INSERT INTO answers (userid, questionid, answer) VALUES (?, ?, ?)",
      [userid, questionid, answer]
    );

    return res
      .status(StatusCodes.OK)
      .json({ msg: "Answer posted successfully" });
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong. Please try again later" });
  }
}

// Get all answers for a question function
async function getAnswer(req, res) {
  const { id } = req.params;
  try {
    const [question] = await dbconnection.query(
      "SELECT questionid FROM questions WHERE id = ?",
      [id]
    );

    // Check if the query returned any results
    if (!question || !question[0] || !question[0].questionid) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question not found" });
    }

    const questionid = question[0].questionid;
    const [answer] = await dbconnection.query(
      "SELECT answer, answers.userid, username FROM answers INNER JOIN users ON answers.userid = users.userid WHERE questionid = ? ORDER BY answers.answerid DESC",
      [questionid]
    );

    return res.status(StatusCodes.OK).json(answer);
  } catch (error) {
    console.error(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, please try again later" });
  }
}

module.exports = { postAnswer, getAnswer };
