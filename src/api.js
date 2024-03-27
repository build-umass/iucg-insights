//TODO: replace with requests
export const BASE_URL = "http://localhost:5000"

/*** ARTICLES ***/
export async function getArticle(id) {
  return fetch(BASE_URL + `/api/articles/${id}`).then(a => a.json())
}

export async function getArticles() {
  return fetch(BASE_URL + `/api/articles`).then(a => a.json())
}

/**
 *
 * @param {string} title
 * @param {string[]} categories
 * @param {string[]} industries
 * @param {string[]} authors
 */
export async function searchArticle(title, categories, industries, authors) {
  // if the search field is empty (default), get all
  if (!title && !categories && !industries && !authors) return getArticles()
  return fetch(BASE_URL + `/api/articles/search`, {
    method: "POST",
    body: JSON.stringify({ title, categories, industries, authors }),
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

export async function getIndustries() {
  return fetch(BASE_URL+`/api/industries`, { headers: { "Content-Type": "application/json"}})
    .then(a => a.json())
}

export async function createIndustry(name) {
  return fetch(BASE_URL+`/api/industries`, {
    method: "POST",
    body: JSON.stringify({ content: name }),
    headers: {"Content-Type": "application/json"}
  }).then(a => a.json())
}

export async function deleteIndustry(id) {
  return fetch(BASE_URL+`/api/industries/${id}`, { method: "DELETE" })
}

export async function getCategories() {
  return fetch(BASE_URL+`/api/categories`, { headers: { "Content-Type": "application/json"}})
    .then(a => a.json())
}

export async function createCategory(name) {
  return fetch(BASE_URL+`/api/categories`, {
    method: "POST",
    body: JSON.stringify({ content: name }),
    headers: {"Content-Type": "application/json"}
  }).then(a => a.json())
}

export async function deleteCategory(id) {
  return fetch(BASE_URL+`/api/industries/${id}`, { method: "DELETE" })
}

export async function getAuthors() {
  return fetch(BASE_URL+`/api/authors`, { headers: { "Content-Type": "application/json"}})
    .then(a => a.json())
}

export async function createAuthor(name, imageID) {
  return fetch(BASE_URL+`/api/categories`, {
    method: "POST",
    body: { name, imageID },
    headers: {"Content-Type": "application/json"}
  }).then(a => a.json())
}

export async function updateAuthor(id, name, imageID) {
  return fetch(BASE_URL+`/api/categories/${id}`, {
    method: "PUT",
    body: { name, imageID },
    headers: {"Content-Type": "application/json"}
  }).then(a => a.json())
}

export async function deleteAuthor(id) {
  return fetch(BASE_URL+`/api/authors/${id}`, { method: "DELETE" })
}



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

