require("dotenv").config();
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port:3306,
});

const port = process.env.APP_PORT || 8080;
connection.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
  } else {
    console.log("Connected to MySQL database!");
  }
});


// let q = `INSERT INTO data(id,email,username,password) VALUES(1001,'alice00@gmail.com','alice_00','aliceTest00')`;

// let q = `INSERT INTO data(id,email,username,password) VALUES ?`;
// let data = [
//     [1002,"chloe00@gmail.com","chloe_00","chloeTest00"],
//     [1003,"dei00@gmail.com","dei_00","deiTest00"]
// ];

// let q = `INSERT INTO data (id,email,username,password) VALUES ?`;
// let data = [];
// const randomData = () => {
//   return [
//     uuidv4(),
//     faker.internet.email(),
//     faker.internet.username(),
//     faker.internet.password(),
//   ];
// };

// for (let i = 1; i <= 10; i++) {
//   data.push(randomData());
// }

// try {
//   connection.query(q, [data],(err, result) => {
//     if (err) throw err;
//     console.log(result);
//   });
// } catch (err) {
//   console.log(err);
// }

//NEW ROUTE
app.get("/users/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/users", (req, res) => {
  let id = uuidv4();
  let { username, email, password } = req.body;
  console.log({ id, email, username, password });

  let q = `INSERT INTO data(id,email,username,password) VALUES ('${id}','${email}','${username}','${password}')`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.redirect("/users");
    });
  } catch (err) {
    console.log(err);
  }
});

//SHOW ROUTE
app.get("/users", (req, res) => {
  let q = `SELECT * FROM data`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let users = result;
      let q2 = `SELECT COUNT(*) FROM data`;
      try {
        connection.query(q2, (err, result) => {
          if (err) throw err;

          let count = result[0]["COUNT(*)"];
          // console.log(count);
          res.render("index.ejs", { users, count });
        });
      } catch (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//EDIT ROUTE
app.get("/users/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM data WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let data = result[0];
      // console.log(data);
      res.render("edit.ejs", { data });
    });
  } catch (err) {
    console.log(err);
  }
});

//UPDATE ROUTE
app.patch("/users/:id", (req, res) => {
  let { id } = req.params;
  let { username, password: newPass } = req.body;
  let q = `SELECT * FROM data WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let data = result[0];
      console.log(data);
      if (newPass != data.password) {
        res.send("WRONG PASSWORD");
      } else {
        let q2 = `UPDATE data SET username = '${username}' WHERE id = '${id}'`;
        try {
          connection.query(q2, (err, result) => {
            if (err) throw err;
            res.redirect("/users");
          });
        } catch (err) {
          console.log(err);
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//DELETE ROUTE
app.get("/users/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM data WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let data = result[0];
      console.log(data);
      res.render("destroy.ejs", { data });
    });
  } catch (err) {
    console.log(err);
  }
});

app.delete("/users/:id", (req, res) => {
  let { id } = req.params;
  let { password: newPass, email: newEmail } = req.body;
  let q = `SELECT * FROM data WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let data = result[0];
      console.log(data);
      if (newPass != data.password && newEmail != data.email) {
        res.send("Sorry! cant be deleted! Re-check your email & password.");
      } else {
        let q2 = `DELETE FROM data WHERE id = '${id}'`;
        try {
          connection.query(q2, (err, result) => {
            if (err) throw err;
            console.log(data);
            res.redirect("/users");
          });
        } catch (err) {
          console.log(err);
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`App is listening at port ${port}.`);
});
