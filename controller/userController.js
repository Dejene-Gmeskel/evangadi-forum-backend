const mydbconnection = require("../DB/dbConfig");

const bycrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;
  // console.log(req.body);
  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide the full credentials" });
  }
  try {
    const [user] = await mydbconnection.query(
      "SELECT username,userid from users WHERE username =? or email = ?",
      [username, email]
    );

    if (user.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "user already existed" });
    }
    if (password.length <= 7) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Password should be at least 8 characters" });
    }
    // encrypting the password
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    await mydbconnection.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?,?,?,?,?)",
      [username, firstname, lastname, email, hashedPassword]
    );
    return res.status(StatusCodes.CREATED).json({ msg: "user registered" });
  } catch (error) {
    //console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "server error,please try again later" });
  }
}
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide all the required information" });
  }

  try {
    const [user] = await mydbconnection.query(
      "SELECT firstname,userid,password from users WHERE  email = ?",
      [email]
    );
    if (user.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credentials" });
    }
    const isMatch = await bycrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid credentials" });
    }
    const firstname = user[0].firstname;
    const userid = user[0].userid;
    const token = jwt.sign({ firstname, userid }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });

    return res
      .status(StatusCodes.OK)
      .json({ msg: "user login successful", token, firstname });

    // return res.json({ user: user[0].password });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "server error,please try again later" });
  }
}
async function checkUser(req, res) {
  const firstname = req.user.firstname;
  const userid = req.user.userid;
  res.status(StatusCodes.OK).json({ msg: "valid user", firstname, userid });
  // res.send("user checked");
}

module.exports = { register, login, checkUser };
