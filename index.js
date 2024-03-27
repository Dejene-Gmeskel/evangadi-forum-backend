const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT
const cors = require("cors");
app.use(cors());

//database connection
const mydbconnection = require("./DB/dbConfig");
// user route middle-ware file
const userRoutes = require("./routes/userRoutes");
// question route middle-ware file
const questionRoutes = require("./routes/questionRoutes");
// answer route middle-ware file
const answerRoutes = require("./routes/answerRoutes");

// json route middle-ware
app.use(express.json());
// user route middle ware
app.use("/api/users", userRoutes);
// question route middle ware
app.use("/api/questions", questionRoutes);
// answer route middle ware
app.use("/api/answers", answerRoutes);

const start = async () => {
  try {
    const result = await mydbconnection.execute("SELECT 'test'");
    //console.log(result);
    app.listen(port);
    console.log(`http://localhost:${port}`);
    console.log("DB connection Established");
  } catch (error) {
    //console.log(error.message);
  }
};

start();
