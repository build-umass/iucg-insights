import axios from "axios";
import {Buffer} from "buffer";
axios.defaults.baseURL = `http://localhost:5000`;

async function _getArticle(id) {
  let { data } = await axios.get(`/api/articles/${id}`);
  //TODO: not have placeholder images
  data.contentImg = (await axios.get("https://dog.ceo/api/breeds/image/random")).data.message;
  if (data.photo) {
    data.contentImg = `data:${data.photo.contentType};base64, ${Buffer.from(data.photo.data).toString('base64')}`;
  }
  data.authorImg = (await axios.get("https://dog.ceo/api/breeds/image/random")).data.message;
  return data;
}

async function _getArticles() {
  let { data } = await axios.get("/api/articles");
  console.log(data)
  data = await Promise.all(data.map(async article => {
    var contentImg = (await axios.get("https://dog.ceo/api/breeds/image/random")).data.message;
    if (article.photo) {
      contentImg = `data:${article.photo.contentType};base64, ${Buffer.from(article.photo.data).toString('base64')}`;
    }
    return {...article, contentImg: contentImg };
  }));
  return data;
}

async function _searchArticle(searchText) {
  if (searchText === "") { // if the search field is empty (default), get all
    return await _getArticles()
  }
  let { data } = await axios.post("/api/articles/search/", { title: searchText });
  data = await Promise.all(data.map(async article => {
    var contentImg = (await axios.get("https://dog.ceo/api/breeds/image/random")).data.message;
    if (article.photo) {
      contentImg = `data:${article.photo.contentType};base64, ${Buffer.from(article.photo.data).toString('base64')}`;
    }
    return {...article, contentImg: contentImg };
  }));
  console.log("------")
  console.log(data)
  return data;
}

async function _createArticle(article) {
  return await axios.post("/api/articles", article).data;
}

async function _deleteArticle(id) {
  await axios.delete(`/api/articles/${id}`);
}

async function _updateArticle(id, article) {
  await axios.put(`/api/articles/${id}`, article);
}

function wrap(func, ...a) {
  return new Promise((resolve, reject) => {
    try { resolve(func(...a)) }
    catch(e) { console.error(`error in ${func.name}\n${e}`); reject(); }
  })
}

export function getArticle(...a) { return wrap(_getArticle, ...a) }
export function getArticles(...a) { return wrap(_getArticles, ...a) }
export function searchArticle(...a) { return wrap(_searchArticle, ...a) }
export function createArticle(...a) { return wrap(_createArticle, ...a) }
export function deleteArticle(...a) { return wrap(_deleteArticle, ...a) }
export function updateArticle(...a) { return wrap(_updateArticle, ...a) }

