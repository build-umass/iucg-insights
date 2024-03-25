// server.js
// This is the server file for the application.
// It is responsible for setting up the server and connecting to the database.
// It also contains the API routes for the application.

// access env variables
require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Article = require("./models/article");
// const Tag = require("./models/tags");
const Category = require("./models/categories")
const Industry = require("./models/industries")
const Author = require("./models/authors")

const TempImage = require("./models/tempimage")

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
// const path = require("path")
// app.use(express.static(path.join(__dirname, './build')))

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

  //when creating an article we also have to flush tempimages
  await TempImage.deleteMany({})
  
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
  const article = await Article.findByIdAndDelete(id);

  for (const img of [article.contentImgID, article.authorImgID, ...article.images]) {
    await fetch(process.env.AWS_URL + img, {
      method: "DELETE",
      headers: { "x-api-key": process.env.AWS_API_KEY }
    })
  }
  
  res.json({ message: "Article deleted." });
}));

/*** IMAGES ***/
app.get("/api/images/:id", wrap(async (req, res) => {
  res.redirect(process.env.AWS_URL + req.params.id)
}))

app.put("/api/images", upload.array("files"), async (req, res) => {
  console.log("hit here")
  console.log(req.files)
  
  for (const file of req.files) {
    await fetch(process.env.AWS_URL + file.originalname, {
      method: "PUT",
      body: file.buffer,
      headers: { "x-api-key": process.env.AWS_API_KEY }
    })
  }

  res.json(req.files.map(a => ({ id: a.originalname })))
  
}) 

app.put("/api/images/:id", upload.single("file"), async (req, res) => {

  await fetch(process.env.AWS_URL + req.params.id, {
    method: "PUT",
    body: req.file.buffer,
    headers: { "x-api-key": process.env.AWS_API_KEY }
  })

  res.json({ id: req.params.id })
})


app.delete("/api/images/:id", wrap(async (req, res) => {
  console.log("delete image")
  await fetch(process.env.AWS_URL + req.params.id, {
    method: "DELETE",
    headers: { "x-api-key": process.env.AWS_API_KEY }
  })

  res.send({ id: req.params.id })
 
}))

/*** TEMP IMAGES ***/
/* this is a kinda weird thing I have to do for article creation
 * I want them to be able to use the images in the articles to 
 * preview, but where do I store them? A new database, tempimages!
 * this just temporarily holds image ids while doing image creation
 * and gets flushed after the article is actually created. This should
 * be done in the API probably so I just make the article creation
 * call and it does it.
 */
app.get("/api/tempimages", wrap(async (_, res) => {
  const articles = await TempImage.find();
  res.json(articles)
}))

app.delete("/api/tempimages", wrap(async (_, res) => {
  console.log("clear temp images")
  await TempImage.deleteMany({})
  res.send({ message: "tempimages flushed" })
}))

app.delete("/api/tempimages/:id", wrap(async (req, res) => {
  console.log("delete temp image")
  await TempImage.findOneAndDelete({ id: req.params.id })
  res.send({ id: req.params.id })
}))

app.post("/api/tempimages/:id", wrap(async (req, res) => {
  console.log("making tempimg")
  const img = TempImage({ id: req.params.id })
  await img.save()
  res.json(img)
}))

/*** AUTH STUFF ***/
//TODO: login should give password for crud operations
app.post("/login", wrap(async (req, res) => {
  if (req.body.password === "secretpwd")
    res.send("The request was successful, as we wish all people to be");

  else res.status(401).send("Incorrect Password");
}));

//search for article by everything
app.post("/api/articles/search", wrap(async (req, res) => {
  const { title, categories, industries, authors } = req.body;
  const query = { title: { $regex: title, $options: "i" }};
  if (categories) query.categories = { $elemMatch: { $in: categories }}
  if (industries) query.industries = { $elemMatch: { $in: industries }}
  if (authors) query.authors = { $elemMatch: { $in: authors }}

  res.json(await Article.find(query))
}));


/*** TINY GUYS ***/
//tiny guy posts
app.post("/api/categories", wrap(async (req, res) => {
  const category = new Category(req.body)
  await category.save();
  res.json(category);
}));
app.post("/api/induestries", wrap(async (req, res) => {
  const industry = new Industry(req.body)
  await industry.save();
  res.json(industry);
}));
app.post("/api/authors", wrap(async (req, res) => {
  const author = new Author(req.body)
  await author.save();
  res.json(author);
}))
app.put("/api/authors", wrap(async (req, res) => {
  const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(author);
}))

//tiny guy gets
app.get("/api/categories", wrap(async (_, res) => {
  res.json(await Category.find());
}));
app.get("/api/industries", wrap(async (_, res) => {
  res.json(await Industry.find());
}));
app.get("/api/authors", wrap(async (_, res) => {
  res.json(await Author.find());
}));

//tiny guy deletes
app.delete('/api/categories/:id', wrap(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category deleted successfully' });
}));
app.delete('/api/industries/:id', wrap(async (req, res) => {
  await Industry.findByIdAndDelete(req.params.id);
  res.json({ message: 'Industry deleted successfully' });
}));
app.delete('/api/author/:id', wrap(async (req, res) => {
  await Author.findByIdAndDelete(req.params.id);
  res.json({ message: 'Industry deleted successfully' });
}));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));
