

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et quasi, ullam soluta ducimus dolor aut qui laborum, explicabo magnam maxime, debitis minus delectus nisi similique! Voluptas aliquid, quam voluptatem officia numquam facilis, molestias magni sapiente aliquam similique eligendi quia corrupti."
const aboutContent = "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et quasi, ullam soluta ducimus dolor aut qui laborum, explicabo magnam maxime, debitis minus delectus nisi similique! Voluptas aliquid, quam voluptatem officia numquam facilis, molestias magni sapiente aliquam similique eligendi quia corrupti.";
const contactContent = "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et quasi, ullam soluta ducimus dolor aut qui laborum, explicabo magnam maxime, debitis minus delectus nisi similique! Voluptas aliquid, quam voluptatem officia numquam facilis, molestias magni sapiente aliquam similique eligendi quia corrupti.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://markos:amator01@cluster0.qkjxu.mongodb.net/blogDB')
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: String,
  content: String
})

const Post = mongoose.model("post", postSchema)


app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  })

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", async function(req, res){

  const post = new Post();
  post.title = _.capitalize(req.body.postTitle)
  post.content = req.body.postBody
  try{
    await post.save()
    res.redirect("/");
  } catch(e) {
    console.log(e)
  }

});

app.get("/posts/:postId", function(req, res){

  const requestedId = req.params.postId

  Post.findOne({_id: requestedId}, function(err, post){
        res.render("post", {
          title: post.title,
          content: post.content
        })

  });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server has started");
});
