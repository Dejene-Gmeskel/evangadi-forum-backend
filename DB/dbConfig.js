const mysql2 = require("mysql2");
require("dotenv").config();

const mydbconnection = mysql2.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  connectionLimit: 10,
});

// app.get("/install", (req, res) => {
//   let message = "All tables are Created";
//   let users = `CREATE TABLE if not exists users(
//         userid int(30) NOT NULL auto_increment,
//         username varchar(30) not null,
//         firstname varchar(30) not null,
//         lastname varchar(30) not null,
//         email varchar(30) not null,
//         password varchar(100) not null,
//         PRIMARY KEY (userid)
//     )`;

//   let questions = `CREATE TABLE if not exists questions(
//         id int(20) not null auto_increment,
//         questionid varchar(100) not null UNIQUE,
//         userid int(30) not null,
//         title varchar(100) not null,
//         description varchar(255) not null,
//         tag varchar(20),
//         PRIMARY KEY(id,questionid),
//         FOREIGN KEY (userid) REFERENCES users(userid)
//     )`;

//   let answers = `CREATE TABLE if not exists answers(
//         answerid int(30) auto_increment,
//         userid int(30) not null,
//         questionid varchar(100) not null,
//         answer varchar(255) not null,
//         PRIMARY KEY(answerid),
//         FOREIGN KEY (userid) REFERENCES users(userid),
//         FOREIGN KEY (questionid) REFERENCES questions(questionid)
//     )`;
//   mydbconnection.query(users, (err, results, fields) => {
//     if (err) console.log(err.message);
//   });
//   mydbconnection.query(questions, (err, results, fields) => {
//     if (err) console.log(err.message);
//   });
//   mydbconnection.query(answers, (err, results, fields) => {
//     if (err) console.log(err.message);
//   });
//   res.end(message);
// });

module.exports = mydbconnection.promise();
