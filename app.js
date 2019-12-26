//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const ejs = require("ejs");
const _ = require("lodash");

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);
//"Post" keep it as singular

const homeStartingContent = "Hello! This is the Daily Journal project. Here you can write anything you want whenever you want. To submit an entry click the compose button on the top right to get started.  Each post will appear on the home page after submission with a link to the individual post page. Click the about section to find more about the developer.  Click the contact me section to keep in touch.  Happy writing!";
const aboutContent = "I am currently a Queens College senior majoring in Computer Science. My main languages are Java, Python and Javascript.  I am interested in fullstack web development and have experience with the MERN (MongoDB, Express, React, Node) stack.";
const contactContent = "Email: anthonygong9@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));






app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    })
  })
});



app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function (err) {

    if (!err) {

      res.redirect("/");

    }

  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;
  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});


app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
