//TODO: replace with requests
import axios from "axios";
axios.defaults.baseURL = `http://localhost:5000`;

export async function getArticle(id) {
  return await axios.get(`/api/articles/${id}`).data;
}

export async function getArticles() {
  return await axios.get("/api/articles").data;
}

export async function searchArticle(searchText) {
  // if the search field is empty (default), get all
  if (!searchText) return await getArticles()
  return await axios.post("/api/articles/search/", { title: searchText }).data;
}

export async function createArticle(article) {
  return await axios.post("/api/articles", article).data;
}

export async function deleteArticle(id) {
  await axios.delete(`/api/articles/${id}`);
}

export async function updateArticle(id, article) {
  await axios.put(`/api/articles/${id}`, article);
}

export async function createtags(tags) {
  return await axios.post("/api/tags", tags).data;
}

export async function gettags() {
  const tag_data = await axios.get("/api/tags");
  return tag_data.data;
}

export async function deletetag(id) {
  await axios.delete(`/api/tags/${id}`);
}

export async function filterArticle(tag) {
  // if the search field is empty (default), get all
  if (!tag) return await getArticles()
  return await axios.get(`/api/articles/filter/${tag}`).data;
}

export async function getImage(id) {
  return await axios.get(`/api/images/${id}`).data
}

export async function putImage(data) {
  const id = "a.jpg" //TODO: sha256 hash or smth
  return await axios.put(`/api/images/${id}`, data).data
}

export async function deleteImage(id) {
  return await axios.delete(`/api/images/${id}`).data
}
