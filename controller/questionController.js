const dbconnection = require("../DB/dbConfig");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");

async function askQuestion(req, res) {
  const { title, description, tag } = req.body;
  const questionid = uuidv4();
  //console.log(questionid);
  //user id extracted from authMiddleware
  const { userid } = req.user;
  //   console.log(userid);

  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields!" });
  }

  try {
    await dbconnection.query(
      "INSERT INTO questions(questionid,userid,title,description,tag) VALUES(?,?,?,?,?)",
      [questionid, userid, title, description, tag]
    );
    return res.status(StatusCodes.CREATED).json({ msg: "Question submitted" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}
async function allQuestion(req, res) {
  try {
    const [questions] = await dbconnection.query(
      `SELECT q.*, u.username 
        FROM questions q 
        INNER JOIN users u ON q.userid = u.userid 
        ORDER BY q.id DESC `
    );

    if (questions.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "No questions posted yet" });
    }

    res.status(StatusCodes.OK).json(questions);
  } catch (error) {
    // console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}
//single question function
async function singleQuestion(req, res) {
  const { id } = req.params;
  //   console.log(id);
  // const { questionid } = req.body;
  try {
    // Perform a SELECT query to fetch a single question by its ID
    const query = "SELECT * FROM questions WHERE id = ?";
    const [question] = await dbconnection.query(query, [id]);
    // console.log(query)
    // console.log(question[0]);

    if (question.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "The Requested Question is not found" });
    }
    // Send the retrieved question as a JSON response
    res.status(StatusCodes.OK).json(question[0]);
  } catch (error) {
    //console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong while fetching the question",
    });
  }
}
module.exports = { askQuestion, allQuestion, singleQuestion };
