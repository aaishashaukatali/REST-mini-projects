require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
let data = require("./data.js");
const { v4: uuid4 } = require("uuid");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const port = process.env.PORT || 8080;

app.get("/posts", (req, res) => {
  res.render("index.ejs", { data });
});

app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/posts", (req, res) => {
  let { username, content } = req.body;
  let id = uuid4();
  data.push({ id, username, content });
  res.redirect("/posts");
});

app.get("/posts/:id", (req, res) => {
  let { id } = req.params;
  let post = data.find((post) => id === post.id);
  res.render("show.ejs", { post });
});

app.patch("/posts/:id", (req, res) => {
  let { id } = req.params;
  let newContent = req.body.content;
  let post = data.find((post) => id === post.id);

  post.content = newContent;
  res.redirect("/posts");
});

app.delete("/posts/:id", (req, res) => {
  let { id } = req.params;
  data = data.filter((post) => id !== post.id);
  console.log(data);
  res.redirect("/posts");
});

app.get("/posts/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = data.find((post) => id === post.id);
  res.render("edit.ejs", { post });
});

app.get("/", (req, res) => {
  res.send("Working Root");
});

app.listen(port, () => {
  console.log(`App is listening at ${port}.`);
});
