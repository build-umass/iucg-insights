import axios from "axios";
axios.defaults.baseURL = `http://localhost:5000`;

async function _getArticle(id) {
  let { data } = await axios.get(`/api/articles/${id}`);
  //TODO: not have placeholder images
  data.contentImg = (await axios.get("https://dog.ceo/api/breeds/image/random")).data.message;
  data.authorImg = (await axios.get("https://dog.ceo/api/breeds/image/random")).data.message;
  return data;
}

async function _getArticles() {
  let { data } = await axios.get("/api/articles");
  data = await Promise.all(data.map(async article => {
    const contentImg = (await axios.get("https://dog.ceo/api/breeds/image/random")).data.message;
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
export function createArticle(...a) { return wrap(_createArticle, ...a) }
export function deleteArticle(...a) { return wrap(_deleteArticle, ...a) }
export function updateArticle(...a) { return wrap(_updateArticle, ...a) }

