// server.js
// This is the server file for the application.
// It is responsible for setting up the server and connecting to the database.
// It also contains the API routes for the application.

// access env variables
require('dotenv').config();

const express = require("express"); //import express
const mongoose = require("mongoose"); //import mongoose
const cors = require("cors"); //import cors
const multer = require("multer"); //import multer for file upload
const { GridFsStorage } = require('multer-gridfs-storage'); //import gridfs storage engine
const fs = require('file-system');
const Article = require("./models/article"); //import article model



const app = express(); //create express app

// Connect to MongoDB database  
const db = mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, family: 4 })
	.then(() => console.log('Connected to MongoDB'))
	.catch(err => console.error('Error connecting to MongoDB', err));

// Create image bucket
let bucket; 

mongoose.connection.on("connected", () => {
	bucket = new mongoose.mongo.GridFSBucket(mongoose.connections[0].db, {
		bucketName: "images"
	});
	console.log(bucket)
});

// Middleware
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

// Storage Engine
const storage = new GridFsStorage({
	url: process.env.MONGODB_URI,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				const filename = buf.toString('hex') + path.extname(file.originalname);
				const fileInfo = {
					filename: filename,
					bucketName: 'images'
				};
				resolve(fileInfo);
			});
		});
	}
});
 
const upload = multer({ storage });

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

app.post('/upload', upload.single("image"), (req, res) => {
  console.log(req.body);
  var img = fs.readFileSync("TODO fix this method for two schemes?");
  var encode_image = img.toString('base64');
  var finalImg = {
    contentType: 'image/jpg',//req.image.mimetype,
    image: Buffer.from(encode_image, 'base64')
  };
  res.status(200).json("File has been uploaded");
});

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
    var img = fs.readFileSync("TODO REPLACE WITH FILE");
    var encode_image = img.toString('base64');
    var finalImg = {
      contentType: 'image/jpg',
      data: Buffer.from(encode_image, 'base64'),
    };
    req.body.image = finalImg;
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
    
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));
