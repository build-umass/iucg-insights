// server.js
// This is the server file for the application.
// It is responsible for setting up the server and connecting to the database.
// It also contains the API routes for the application.

// access env variables
require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("file-system");
const Article = require("./models/article");
const Tag = require("./models/tags");
const Image = require("./models/image");

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const app = express(); //create express app

// Connect to MongoDB database  
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, family: 4 })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Middleware
app.use(cors());
app.use(express.json());

//serve the website
const path = require("path")
app.use(express.static(path.join(__dirname, './build')))

//error handling
function wrap(func, message="Internal server error.") { return async (...a) => {
  try { return func(...a) }
  catch (error) { console.error(error); res.status(500).json({ message }) }
}}

/*** API routes ***/
//get all articles
app.get("/api/articles", wrap(async (_, res) => {
  const articles = await Article.find().sort({created: -1});
  res.json(articles);
}));

//get article
app.get("/api/articles/:id", wrap(async (req, res) => {
  const { id } = req.params;
  const article = await Article.findById(id);
  res.json(article)
}))

//create article
app.post("/api/articles", wrap(async (req, res) => {
  const article = new Article(req.body);
  await article.save();
  res.json(article);
}));

//update article
app.put("/api/articles/:id", wrap(async (req, res) => {
    const { id } = req.params;
    const updatedArticle = await Article.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found." });
    }
    res.json(updatedArticle);
}));

//delete article
app.delete("/api/articles/:id", wrap(async (req, res) => {
  const { id } = req.params;
  await Article.findByIdAndDelete(id);
  res.json({ message: "Article deleted." });
}));

/*** IMAGES ***/
app.get("/api/images/:id", wrap(async (req, res) => {
  res.redirect(process.env.AWS_URL + req.params.id)
}))

app.put("/api/images/:id", upload.single("file"), async (req, res) => {

  await fetch(process.env.AWS_URL + req.params.id, {
    method: "PUT",
    body: req.file.buffer,
    headers: { "x-api-key": process.env.AWS_API_KEY }
  })

  res.json({ id: req.params.id })
})


app.delete("/api/images/:id", wrap(async (req, res) => {
  await fetch(process.env.AWS_URL + req.params.id, {
    method: "DELETE",
    headers: { "x-api-key": process.env.AWS_API_KEY }
  })

  res.send({ id: req.params.id })
 
}))

//TODO: login should give password for crud operations
app.post("/login", wrap(async (req, res) => {
  console.log(req.body.password)
  if (req.body.password === "secretpwd")
    res.send("The request was successful, as we wish all people to be");

  else res.status(401).json({ message: "Incorrect Password" });
}));

//search for article by title
app.post("/api/articles/search/", wrap(async (req, res) => {
  const { title } = req.body;
  const article = await Article.find({ title: { $regex: title, $options: "i" } });
  res.json(article);
}));

app.post("/api/tags", wrap(async (req, res) => {
  const tags = new Tag(req.body);
  await tags.save();
  res.json(tags);
}));

app.get("/api/tags", wrap(async (_, res) => {
  const tags = await Tag.find();
  console.log('find the tags!');
  console.log(tags);
  res.json(tags);
}));

// Delete a tag by ID
app.delete('/api/tags/:id', wrap(async (req, res) => {
  const { id } = req.params;
  await Tag.findByIdAndDelete(id);
  res.json({ message: 'Tag deleted successfully' });
}));

//filter articles by tag
app.get("/api/articles/filter/:tag", wrap(async (req, res) => {
  const tag = req.params.tag;
  const filteredArticles = await Article.find({ tags: { $in: [tag] } });
  res.json(filteredArticles);
}));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));
