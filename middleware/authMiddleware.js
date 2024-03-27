const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "invalid authentication" });
  }
  const token = authHeader.split(" ")[1];
  // console.log(authHeader);
  // console.log(token);
  try {
    const { firstname, userid } = jwt.verify(token, process.env.JWT_KEY);
    req.user = { firstname, userid };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "invalid authentication" });
  }
}
module.exports = authMiddleware;
