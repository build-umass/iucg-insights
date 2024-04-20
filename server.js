// server.js
// This is the server file for the application.
// It is responsible for setting up the server and connecting to the database.
// It also contains the API routes for the application.

// access env variables
require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const fs = require("fs");
const Article = require("./models/article");
// const Tag = require("./models/tags");
const Category = require("./models/categories")
const Industry = require("./models/industries")
const Author = require("./models/authors")

const TempImage = require("./models/tempimage")

const multer = require('multer');
const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, "./uploads"),
    filename: (req, file, cb) => {
      console.log(file)
      cb(null, file.originalname)
    }
  })
});

const app = express(); //create express app

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client()

const admins = ["amoinus@gmail.com"];

// Connect to MongoDB database  
mongoose.connect("mongodb://localhost:27017/iucg", { useNewUrlParser: true, useUnifiedTopology: true, family: 4 })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

//serve the website
// const path = require("path")
// app.use(express.static(path.join(__dirname, './build')))

//error handling
function wrap(func, message = "Internal server error.") {
  return async (req, res, ...a) => {
    try { return func(req, res, ...a) }
    catch (error) { console.error(error); res.status(500).json({ message }) }
  }
}

//helpful little category/industry update thing
// type is either "industry" or "category"
// name is the name of the category or industry whose count we want to update
async function updateCounts(prop, name) {
  let res = await Article.aggregate([
    { $match: { [prop]: { $elemMatch: { $in: [name] } } } },
    { $count: "totalMatchingDocuments" }
  ])
  let count = res.length ? res[0].totalMatchingDocuments : 0
  console.log(prop, name, count)
  if (prop == "industries") await Industry.updateOne({ content: name }, { count })
  if (prop == "categories") await Category.updateOne({ content: name }, { count })
}

function deleteFile(id) {
  let path = `./uploads/${id}`
  if (fs.existsSync(path)) fs.rmSync(path)
}

/*** API routes ***/
//get all articles
app.get("/api/articles", wrap(async (_, res) => {
  const articles = await Article.find().sort({ created: -1 });
  res.json(articles);
}));

//get article
app.get("/api/articles/:id", wrap(async (req, res) => {
  const { id } = req.params;
  const article = await Article.findById(id);
  res.json(article)
}))

//create article
app.post("/api/articles", authenticate, wrap(async (req, res) => {
  const article = new Article(req.body);
  await article.save();

  //increment categories and industries
  await Promise.all([
    ...article.industries.map(async name => updateCounts("industries", name)),
    ...article.categories.map(async name => updateCounts("categories", name))
  ])

  //when creating an article we also have to flush tempimages
  await TempImage.deleteMany({})

  res.json(article);
}));

//update article
app.put("/api/articles/:id", authenticate, wrap(async (req, res) => {
  const id = req.params.id;
  const before = await Article.findById(id)
  const after = req.body

  //update category and industry counts
  await Promise.all([
    ...before.industries.map(async name => updateCounts("industries", name)),
    ...after.industries.map(async name => updateCounts("industries", name))
  ])
  await Promise.all([
    ...before.categories.map(async name => updateCounts("categories", name)),
    ...after.categories.map(async name => updateCounts("categories", name))
  ])

  res.json(await Article.findByIdAndUpdate(id, req.body, { new: true }));
}));

//delete article
app.delete("/api/articles/:id", authenticate, wrap(async (req, res) => {
  const id = req.params.id;
  const article = await Article.findByIdAndDelete(id);

  //decrement categories and industries
  await Promise.all([
    ...article.industries.map(async name => updateCounts("industries", name)),
    ...article.categories.map(async name => updateCounts("categories", name))
  ])

  for (const img of [article.contentImgID, ...article.images]) {
    deleteFile(img)
  }

  res.json({ message: "Article deleted." });
}));

/*** IMAGES ***/
//serve all our images
if (!fs.existsSync("./uploads")) fs.mkdirSync("./uploads")
app.use("/api/images", express.static("./uploads"));

app.put("/api/images", authenticate, upload.array("files"), async (req, res) => {
  //multer handles actual upload
  res.json(req.files.map(a => ({ id: a.originalname })))

})

app.put("/api/images/:id", authenticate, upload.single("file"), async (req, res) => {
  //multer handles actual upload
  res.json({ id: req.params.id })
})


app.delete("/api/images/:id", authenticate, wrap(async (req, res) => {
  deleteFile(req.params.id)
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

app.delete("/api/tempimages", authenticate, wrap(async (req, res) => {
  await TempImage.deleteMany({})
  res.send({ message: "tempimages flushed" })
}))

app.delete("/api/tempimages/:id", authenticate, wrap(async (req, res) => {
  await TempImage.findOneAndDelete({ id: req.params.id })
  res.send({ id: req.params.id })
}))

app.post("/api/tempimages/:id", authenticate, wrap(async (req, res) => {
  const img = TempImage({ id: req.params.id })
  await img.save()
  res.json(img)
}))

/*** AUTH STUFF ***/
//TODO: login should give password for crud operations
app.post("/login", wrap(async (req, res) => {
  client.verifyIdToken({
    idToken: req.body.credential,
    audience: "55337590525-411lsekong4ho3gritf5sbpgckpgq9ev.apps.googleusercontent.com"
  })
    .then(ticket => {
      res.set("Access-Control-Allow-Origin", "http://localhost:3000").status(200).send("Login Successful");
      console.log(`${ticket.getPayload().email} has logged in`);
    })
    .catch(() => {
      res.status(401).send("Login Failed");
    })
}));

/**
 * Returns empty string on reject
 * @param { } req 
 * @returns 
 */
async function authenticate(req, res, next) {
  const loginToken = req.cookies.loginToken;
  if (!loginToken) {
    console.log("Rejected empty token");
    return;
  }
  const ticket = await client.verifyIdToken({
    idToken: loginToken,
    audience: "55337590525-411lsekong4ho3gritf5sbpgckpgq9ev.apps.googleusercontent.com"
  })
    .catch(() => undefined);
  if (!ticket) {
    console.log("Rejected bad token");
    return;
  }
  const email = ticket.getPayload().email;
  if(!admins.includes(email)){
    console.log("Rejected non-admin token");
    return;
  }
  req.email = ticket.getPayload().email;
  next();
}

app.get("/securetest", authenticate, wrap(async (req, res) => {
  res.status(200).send("Secret Documents");
}));

//search for article by everything
app.post("/api/articles/search", wrap(async (req, res) => {
  const { title, categories, industries, authors } = req.body;
  const query = { title: { $regex: title, $options: "i" } };
  if (categories) query.categories = { $elemMatch: { $in: categories } }
  if (industries) query.industries = { $elemMatch: { $in: industries } }
  if (authors) query.authors = { $elemMatch: { $in: authors } }

  res.json(await Article.find(query))
}));


/*** TINY GUYS ***/
//tiny guy posts
app.post("/api/categories", authenticate,  wrap(async (req, res) => {
  const category = new Category(req.body)

  //disallow dupes
  if (await Category.exists({ content: req.body.content }))
    return res.status(500).json({ message: "No duplicate category names allowed" })

  await category.save();
  res.json(category);
}));
app.post("/api/industries", authenticate, wrap(async (req, res) => {
  const industry = new Industry(req.body)

  //disallow dupes
  if (await Industry.exists({ content: req.body.content }))
    return res.status(500).json({ message: "No duplicate industry names allowed" })

  await industry.save();
  res.json(industry);
}));
app.post("/api/authors", authenticate, wrap(async (req, res) => {
  const author = new Author(req.body)
  await author.save();
  res.json(author);
}))
//tiny guy puts but they're actually just less tiny
app.put("/api/categories/:id", authenticate, wrap(async (req, res) => {
  const before = await Category.findById(req.params.id)

  //disallow dupes
  if (await Category.exists({ content: req.body.content }))
    return res.status(500).json({ message: "No duplicate category names allowed" })

  //rename everything in articles
  await Article.updateMany(
    { categories: before.content },
    { $set: { "categories.$[filter]": req.body.content } },
    { arrayFilters: [{ filter: before.content }] }
  )

  //update actual category
  await Category.findByIdAndUpdate(req.params.id, { content: req.body.content })

  res.json({ message: "updated" })
}))
app.put("/api/industries/:id", authenticate, wrap(async (req, res) => {

  const before = await Industry.findById(req.params.id)

  if (await Industry.exists({ content: req.body.content }))
    return res.status(500).json({ message: "No duplicate category names allowed" })

  //rename everything in articles
  await Article.updateMany(
    { industries: before.content },
    { $set: { "industries.$[filter]": req.body.content } },
    { arrayFilters: [{ filter: before.content }] }
  )

  //update actual category
  await Industry.findByIdAndUpdate(req.params.id, { content: req.body.content })

  res.json({ message: "updated" })
}))
app.put("/api/authors/:id", authenticate, wrap(async (req, res) => {

  //we also need to update all currently existing authors of this name
  await Article.updateMany({ authorID: req.params.id }, { author: req.body.name, authorImgID: req.body.imageID })

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
app.delete('/api/categories/:id', authenticate, wrap(async (req, res) => {
  //remove from all articles
  const category = await Category.findById(req.params.id)
  await Article.updateMany(
    { categories: { $elemMatch: { $eq: category.content } } },
    { $pull: { categories: category.content } }
  )

  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category deleted successfully' });
}));
app.delete('/api/industries/:id', authenticate, wrap(async (req, res) => {
  //remove from all articles
  const industry = await Industry.findById(req.params.id)
  await Article.updateMany(
    { industries: { $elemMatch: { $eq: industry.content } } },
    { $pull: { industries: industry.content } }
  )

  await Industry.findByIdAndDelete(req.params.id);
  res.json({ message: 'Industry deleted successfully' });
}));
app.delete('/api/authors/:id', authenticate, wrap(async (req, res) => {
  //delete the image
  const articles = await Article.find({ authorID: req.params.id })
  if (articles.length > 0) return res.status(500).json({
    message: "the following articles are still using this author:\n" +
      articles.map(a => a.title).join("\n")
  })

  const author = await Author.findById(req.params.id)
  deleteFile(author.imageID)
  
  //then we can delete
  await Author.findByIdAndDelete(req.params.id);
  res.json({ message: 'Industry deleted successfully' });
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));
