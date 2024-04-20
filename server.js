// server.js
// This is the server file for the application.
// It is responsible for setting up the server and connecting to the database.
// It also contains the API routes for the application.

// access env variables
require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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
    filename: (_, file, cb) => {
      cb(null, file.originalname)
    }
  })
});

const app = express(); //create express app

// Connect to MongoDB database  
mongoose.connect("mongodb://localhost:27017/iucg", { useNewUrlParser: true, useUnifiedTopology: true, family: 4 })
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

//helpful little category/industry update thing
// type is either "industry" or "category"
// name is the name of the category or industry whose count we want to update
async function updateCounts(prop, name) {
  let count = await Article.count({ [prop]: { $elemMatch: { $in: [name] } }})
  console.log(count)
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
  const articles = await Article.find().sort({created: -1});
  res.json(articles);
}));

//get article
app.get("/api/articles/:id", wrap(async (req, res) => {
  res.json(await Article.findById(req.params.id))
}))
//get and READ article
app.get("/api/articles/read/:id", wrap(async (req, res) => {
  await Article.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1} })
  res.json(await Article.findById(req.params.id))
}))

//create article
app.post("/api/articles", wrap(async (req, res) => {
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
app.put("/api/articles/:id", wrap(async (req, res) => {
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

  res.json(await Article.findByIdAndUpdate(id, { ...req.body, edited: Date.now() }, { new: true }));
}));

//delete article
app.delete("/api/articles/:id", wrap(async (req, res) => {
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

app.put("/api/images", upload.array("files"), async (req, res) => {
  //multer handles actual upload
  res.json(req.files.map(a => ({ id: a.originalname })))
  
}) 

app.put("/api/images/:id", upload.single("file"), async (req, res) => {
  //multer handles actual upload
  res.json({ id: req.params.id })
})


app.delete("/api/images/:id", wrap(async (req, res) => {
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

app.delete("/api/tempimages", wrap(async (_, res) => {
  await TempImage.deleteMany({})
  res.send({ message: "tempimages flushed" })
}))

app.delete("/api/tempimages/:id", wrap(async (req, res) => {
  await TempImage.findOneAndDelete({ id: req.params.id })
  res.send({ id: req.params.id })
}))

app.post("/api/tempimages/:id", wrap(async (req, res) => {
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

  const { title, categories, industries, authors, relevance } = req.body;
  const query = { $text: { $search: title }};
  if (categories) query.categories = { $elemMatch: { $in: categories }}
  if (industries) query.industries = { $elemMatch: { $in: industries }}
  if (authors) query.authors = { $elemMatch: { $in: authors }}

  //decay all searched stuff
  let today = new Date()
  today.setUTCHours(0,0,0,0)
  const articles = await Article.find({ ...query, lastDecayed: { $lt: today }})
  const { clicks_coef, clicks_exp, decay_coef, decay_exp, decay_rate, age_coef } = getSettings()

  await Promise.all(articles.map(async article => {
    const age = Math.round(Date.now() - article.created.getTime() / (1000 * 3600 * 24))
    const decays = Math.floor(Date.now() - article.lastDecayed.getTime() / (1000 * 3600 * 24))

    await Article.findByIdAndUpdate(article._id, {
      relevance: age_coef ** (-1 * age * age_exp) 
        + decay_coef * (article.clicksDecaying ** decay_exp)
        + clicks_coef * (article.clicks ** clicks_exp),
      clicksDecaying: article.clicksDecaying * decay_rate ** decays,
      lastDecayed: today
    })
  }));

  const sort = { score: { $meta: "textScore" }}
  if (relevance) sort = { relevance: 1 }

  res.json(await Article.find(query).sort(sort))
}));

/*** SETTINGS STUFF ***/
function getSettings() {
  if (!fs.existsSync("./settings.json")) return {
    clicks_coef: 1,
    clicks_exp: 0.5,
    decay_coef: 5,
    decay_exp: 1,
    decay_rate: 0.99,
    age_coef: 40,
    age_exp: 3,
    allowed_emails: ["maxwelltang@umass.edu", "bgillg@umass.edu"]
  }
  
  return JSON.parse(fs.readFileSync("./settings.json"))
}
function setSettings(json) {
  fs.writeFileSync("./settings", json)
}

app.get("/api/settings", wrap(async (_, res) => {
  res.json(getSettings())
}))
app.put("/api/settings", wrap(async (req, _) => {
  setSettings(req.body)
  res.send()
}))

/*** TINY GUYS ***/
//tiny guy posts
app.post("/api/categories", wrap(async (req, res) => {
  const category = new Category(req.body)

  //disallow dupes
  if (await Category.exists({ content: req.body.content }))
    return res.status(500).json({ message: "No duplicate category names allowed"})

  await category.save();
  res.json(category);
}));
app.post("/api/industries", wrap(async (req, res) => {
  const industry = new Industry(req.body)

  //disallow dupes
  if (await Industry.exists({ content: req.body.content }))
    return res.status(500).json({ message: "No duplicate industry names allowed"})

  await industry.save();
  res.json(industry);
}));
app.post("/api/authors", wrap(async (req, res) => {
  const author = new Author(req.body)
  await author.save();
  res.json(author);
}))
//tiny guy puts but they're actually just less tiny
app.put("/api/categories/:id", wrap(async (req, res) => {

  const before = await Category.findById(req.params.id)

  //disallow dupes
  if (await Category.exists({ content: req.body.content }) )
    return res.status(500).json({ message: "No duplicate category names allowed"})

  //rename everything in articles
  await Article.updateMany(
    { categories: before.content },
    { $set: {"categories.$[filter]": req.body.content}},
    { arrayFilters: [{ filter: before.content }]}
  )

  //update actual category
  await Category.findByIdAndUpdate(req.params.id, { content: req.body.content })
  
  res.json({ message: "updated" })
}))
app.put("/api/industries/:id", wrap(async (req, res) => {

  const before = await Industry.findById(req.params.id)

  if (await Industry.exists({ content: req.body.content }) )
    return res.status(500).json({ message: "No duplicate category names allowed"})

  //rename everything in articles
  await Article.updateMany(
    { industries: before.content },
    { $set: {"industries.$[filter]": req.body.content}},
    { arrayFilters: [{ filter: before.content }]}
  )

  //update actual category
  await Industry.findByIdAndUpdate(req.params.id, { content: req.body.content })

  res.json({ message: "updated" })
}))
app.put("/api/authors/:id", wrap(async (req, res) => {

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
app.delete('/api/categories/:id', wrap(async (req, res) => {
  //remove from all articles
  const category = await Category.findById(req.params.id)
  await Article.updateMany(
    {categories: {$elemMatch: { $eq: category.content }}},
    {$pull: {categories: category.content}}
  )

  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category deleted successfully' });
}));
app.delete('/api/industries/:id', wrap(async (req, res) => {
  //remove from all articles
  const industry = await Industry.findById(req.params.id)
  await Article.updateMany(
    {industries: {$elemMatch: { $eq: industry.content }}},
    {$pull: {industries: industry.content}}
  )

  await Industry.findByIdAndDelete(req.params.id);
  res.json({ message: 'Industry deleted successfully' });
}));
app.delete('/api/authors/:id', wrap(async (req, res) => {
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
