import axios from "axios";
import { Buffer } from "buffer";
axios.defaults.baseURL = `http://localhost:5000`;

//TODO: ensure all aritlces have a contentimg, if nothing else than the default one
async function _getArticle(id) {
  let { data } = await axios.get(`/api/articles/${id}`);
  //default: placeholder images
  if (!data.contentImg) {
    data.contentImg = (await axios.get("https://dog.ceo/api/breeds/image/random")).data.message;
  } else {
    let img = (await axios.get(`/api/images/${data.contentImg}`)).data;
    console.log(img);
    data.contentImg = `data:${img.type};base64, ${Buffer.from(img.data).toString('base64')}`;
  }
  data.authorImg = (await axios.get("https://dog.ceo/api/breeds/image/random")).data.message;
  return data;
}

async function _getArticles() {
  let { data } = await axios.get("/api/articles");
  data = await Promise.all(data.map(async article => {
    if (!article.contentImg) {
      article.contentImg = (await axios.get("https://dog.ceo/api/breeds/image/random")).data.message;
    } else {
      let img = (await axios.get(`/api/images/${article.contentImg}`)).data;
      console.log(img);
      article.contentImg = `data:${img.type};base64, ${Buffer.from(img.data).toString('base64')}`;
    }
    return {...article};
  }));
  return data;
}

async function _searchArticle(searchText) {
  if (searchText === "") { // if the search field is empty (default), get all
    return await _getArticles()
  }
  let { data } = await axios.post("/api/articles/search/", { title: searchText });
  data = await Promise.all(data.map(async article => {
    if (!article.contentImg) {
      article.contentImg = (await axios.get("https://dog.ceo/api/breeds/image/random")).data.message;
    } else {
      let img = (await axios.get(`/api/images/${article.contentImg}`)).data;      console.log(img);
      article.contentImg = `data:${img.type};base64, ${Buffer.from(img.data).toString('base64')}`;
    }
    return {...article};
  }));
  return data;
}

async function _createArticle(article) {
  return await axios.post("/api/articles", article).data;
}

async function _deleteArticle(id) {
  await axios.delete(`/api/articles/${id}`);
}

async function _updateArticle(id, article) {
  article.contentImg = (await axios.get(`/api/articles/${id}`)).contentImg;
  await axios.put(`/api/articles/${id}`, article);
}

async function _createtags(tags) {
  console.log("create tags");
  console.log(tags);
  return await axios.post("/api/tags", tags).data;
}

async function _gettags() {
  const tag_data = await axios.get("/api/tags");
  // console.log("get tag_data");  
  // console.log(tag_data.data);
  // // tag_data = await Promise.all(tag_data.map(async (content) => {
  // //   // const response = await axios.get("/api/tags");
  // //   return content.data;
  // // }));
  return tag_data.data;
}

async function _deletetag(id) {
  await axios.delete(`/api/tags/${id}`);
}

async function _filterArticle(tag) {
  if (tag === "") { // if the search field is empty (default), get all
    return await _getArticles()
  }
  let { data } = await axios.get(`/api/articles/filter/${tag}`);
  data = await Promise.all(data.map(async article => {
    if (!article.contentImg) {
      article.contentImg = (await axios.get("https://dog.ceo/api/breeds/image/random")).data.message;
    } else {
      let img = (await axios.get(`/api/images/${article.contentImg}`)).data;      console.log(img);
      article.contentImg = `data:${img.type};base64, ${Buffer.from(img.data).toString('base64')}`;
    }
    return {...article};
  }));
  return data; 
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
export function createtags(...a) { return wrap(_createtags, ...a) }
export function gettags(...a) { return wrap(_gettags, ...a) }
export function deletetag(...a) { return wrap(_deletetag, ...a) }
export function filterArticlesByTag(...a) { return wrap(_filterArticle, ...a) }
