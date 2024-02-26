//TODO: replace with requests
export const BASE_URL = "http://localhost:5000"

/*** ARTICLES ***/
export async function getArticle(id) {
  return fetch(BASE_URL + `/api/articles/${id}`).then(a => a.json())
}

export async function getArticles() {
  return fetch(BASE_URL + `/api/articles`).then(a => a.json())
}

export async function searchArticle(searchText) {
  // if the search field is empty (default), get all
  if (!searchText) return await getArticles()
  return fetch(BASE_URL + `/api/articles/search`, {
    method: "POST",
    body: JSON.stringify({ title: searchText }),
    headers: {"Content-Type": "application/json"}
  }).then(a => a.json())
}

export async function createArticle(article) {
  return fetch(BASE_URL + "/api/articles", {
    method: "POST",
    body: JSON.stringify(article),
    headers: {"Content-Type": "application/json"}
  }).then(a => a.json())
}

export async function deleteArticle(id) {
  return fetch(BASE_URL + `/api/articles/${id}`, { method: "DELETE" })
}

export async function updateArticle(id, article) {
  return fetch(BASE_URL+`/api/articles/${id}`, {
    method: "PUT",
    body: JSON.stringify(article),
    headers: {"Content-Type": "application/json"}
  }).then(a => a.json())
}

/*** TAGS INFO: these are unused ***/
/*export async function createtags(tags) {
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
}*/

/*** IMAGES ***/
/* INFO: these are literally never used anywhere
export async function getImage(id) {
  return fetch(BASE_URL + `/api/images/${id}`).then(a => a.body())
}

export async function putImage(id, data) {
  return axios.put(`/api/images/${id}`, data).then(a => a.data)
}*/

export async function putFormData(data) {
  return fetch(BASE_URL+"/api/images", {
    method: "PUT",
    body: data,
  }).then(a => a.json())
}

export async function deleteImage(id) {
  return fetch(`${BASE_URL}/api/images/${id}`, { method: "DELETE" }).then(a => a.json())
}

/*** TEMPIMAGES ELSE ***/
export async function getTempImages() {
  return fetch(`${BASE_URL}/api/tempimages`)
    .then(a => a.json())
    .then(a => a.map(a => a.id))
}
export async function postTempImage(id) {
  return fetch(`${BASE_URL}/api/tempimages/${id}`, { method: "POST"})
}
export async function deleteTempImage(id) {
  return fetch(`${BASE_URL}/api/tempimages/${id}`, { method: "DELETE"})
}

/*** LOGIN ***/
export async function login(password) {
  return new Promise((resolve, reject) => fetch(`${BASE_URL}/login`, {
    method: "POST",
    body: JSON.stringify({ password }),
    headers: {"Content-Type": "application/json"}
  }).then(res => {
    if (res.status == 401) reject()
    else resolve()
  }))
}

