import axios from "axios";
import {Buffer} from "buffer";
axios.defaults.baseURL = `http://localhost:5000`;

async function _getArticle(id) {
  let { data } = await axios.get(`/api/articles/${id}`);
  //TODO: not have placeholder images
  data.contentImg = (await axios.get("https://dog.ceo/api/breeds/image/random")).data.message;
  if (data.image) {
	  console.log('here');
	  data.contentImg = `data:${data.image.contentType};base64, ${Buffer.from(data.image.data).toString('base64')}`;
  } else {
	  console.log('sike');
  }
  data.authorImg = (await axios.get("https://dog.ceo/api/breeds/image/random")).data.message;
  return data;
}

async function _getArticles() {
  let { data } = await axios.get("/api/articles");
  data = await Promise.all(data.map(async article => {
    var contentImg = (await axios.get("https://dog.ceo/api/breeds/image/random")).data.message;
    if (article.image) {
      console.log('here');
      contentImg = `data:${article.image.contentType};base64, ${Buffer.from(article.image.data).toString('base64')}`;
    } else {
      console.log('sike');
    }
    return {...article, contentImg: contentImg };
  }));
  return data;
}

async function _createArticle(article) {
  return await axios.post("/api/articles", article).data;
}

async function _deleteArticle(id) {
  await axios.delete(`/api/articles/${id}`);
}

async function _updateArticle(id) {
  //TODO: Merge yiming's code and fold it into this
  //const { title, subtitle, synopsis, author, content } = req.body;
  // const article = await Article.findById(id);  //find article by id
  // if (!article) {
  //   return res.status(404).json({ message: "Article not found" });  //return 404 if article not found
  // }
  // article.title = title;
  // article.subtitle = subtitle;
  // article.synopsis = synopsis;
  // article.author = author;
  // article.content = content;
  // await article.save();  //save updated article to database
  // res.json(article);  //return updated article as JSON
  await axios.put(`/api/articles/${id}`);
}

function wrap(func, ...a) {
  return new Promise((resolve, reject) => {
    try { resolve(func(...a)) }
    catch(e) { console.error(`error in ${func.name}\n${e}`); reject(); }
  })
}

export function getArticle(...a) { return wrap(_getArticle, ...a) }
export function getArticles(...a) { return wrap(_getArticles, ...a) }
export function createArticle(...a) { return wrap(_createArticle, ...a) }
export function deleteArticle(...a) { return wrap(_deleteArticle, ...a) }
export function updateArticle(...a) { return wrap(_updateArticle, ...a) }

