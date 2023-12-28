//TODO: replace with requests
import axios from "axios";
axios.defaults.baseURL = `http://localhost:5000`;

/*** ARTICLES ***/
export async function getArticle(id) {
  return axios.get(`/api/articles/${id}`).then(a => a.data);
}

export async function getArticles() {
  return axios.get("/api/articles").then(a => a.data);
}

export async function searchArticle(searchText) {
  // if the search field is empty (default), get all
  if (!searchText) return await getArticles()
  return axios.post("/api/articles/search/", { title: searchText }).then(a => a.data)
}

export async function createArticle(article) {
  return axios.post("/api/articles", article).then(a => a.data);
}

export async function deleteArticle(id) {
  await axios.delete(`/api/articles/${id}`);
}

export async function updateArticle(id, article) {
  await axios.put(`/api/articles/${id}`, article);
}

/*** TAGS ***/
export async function createtags(tags) {
  return axios.post("/api/tags", tags).then(a => a.data);
}

export async function gettags() {
  const tag_data = await axios.get("/api/tags");
  return tag_data.data;
}

export async function deletetag(id) {
  return await axios.delete(`/api/tags/${id}`).then(a => a.data);
}

export async function filterArticle(tag) {
  // if the search field is empty (default), get all
  if (!tag) return await getArticles()
  return axios.get(`/api/articles/filter/${tag}`).then(a => a.data)
}

/*** IMAGES ***/
export async function getImage(id) {
  return axios.get(`/api/images/${id}`).then(a => a.data)
}

export async function putImage(id, data) {
  return axios.put(`/api/images/${id}`, data).then(a => a.data)
}

export async function putFormData(data) {
  console.log("has been put")
  console.log(data)
  return axios.put(`/api/images`, data).then(a => a.data)
}

export async function deleteImage(id) {
  return axios.delete(`/api/images/${id}`).then(a => a.data)
}

/*** TEMPIMAGES ELSE ***/
export async function getTempImages() {
  return axios.get(`/api/tempimages`)
    .then(a => a.data)
    .then(a => a.map(a => a.id))
}
export async function postTempImage(id) {
  await axios.post(`/api/tempimages/${id}`)
}
export async function deleteTempImage(id) {
  await axios.delete(`/api/tempimages/${id}`)
}

