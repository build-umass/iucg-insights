// Description: This file contains the routes for the application
// In progress: edit route
const express = require("express"); //import express
const router = express.Router();  //create router
const Article = require("../models/article");   //import article model

// GET /api/articles 
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find();  //find all articles
    res.json(articles);  //return articles as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/articles
router.post("/", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }
  try {
    const article = new Article({ title,subtitle,synopsis,author,content });  //create new article
    await article.save();  //save article to database
    res.json(article);  //return article as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route for uploading a photo for an article
// In progress

// DELETE /api/articles/:id
router.delete("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);  //find article by id
    if (!article) {
      return res.status(404).json({ message: "Article not found" });  //return 404 if article not found
    }
    await article.remove();  //remove article from database
    res.json({ message: "Article deleted" });  //return success message
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;  //export router
