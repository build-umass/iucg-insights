// server.js
// This is the server file for the application.
// It is responsible for setting up the server and connecting to the database.
// It also contains the API routes for the application.

// access env variables
require('dotenv').config();

const express = require("express"); //import express
const mongoose = require("mongoose"); //import mongoose
const cors = require("cors"); //import cors
const Article = require("./models/article"); //import article model
const Tag = require("./models/tags"); //import tag model
const app = express(); //create express app

// Connect to MongoDB database  
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, family: 4 })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.get("/api/articles", async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/api/articles/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    res.json(article)
  }
  catch(error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error." })
  }
})

app.post("/login", async (req, res) => {
  console.log(req.body.password)
  try {
    if (req.body.password === "isenbrocode") {
      res.send("The request was successful, unlike the isenbros");
    } else {
      res.status(401).json({ message: "Internal server error." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/api/articles", async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.delete("/api/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Article.findByIdAndDelete(id);
    res.json({ message: "Article deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.put("/api/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedArticle = await Article.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found." });
    }
    res.json(updatedArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/api/articles/search/", async (req, res) => {
  try {
    const { title } = req.body;
    const article = await Article.find({ title: { $regex: title, $options: "i" } });
    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/api/tags", async (req, res) => {
  try {
    const tags = new Tag(req.body);
    await tags.save();
    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/api/tags", async (req, res) => {
  try {
    const tags = await Tag.find();
    console.log('find the tags!');
    console.log(tags);
    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Delete a tag by ID
app.delete('/api/tags/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Tag.findByIdAndDelete(id);
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//filter articles by tag
app.get("/api/articles/filter/:tag", async (req, res) => {
  try {
    const tag = req.params.tag;
    const filteredArticles = await Article.find({ tags: { $in: [tag] } });
    res.json(filteredArticles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));
