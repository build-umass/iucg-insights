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
    headers: { "Content-Type": "application/json" }
  }).then(a => a.json())
}

export async function createArticle(article) {
  return fetch(BASE_URL + "/api/articles", {
    mode: "cors",
    credentials: "include",
    method: "POST",
    body: JSON.stringify(article),
    headers: { "Content-Type": "application/json" }
  }).then(a => a.json())
}

export async function deleteArticle(id) {
  return fetch(BASE_URL + `/api/articles/${id}`, {
    mode: "cors",
    credentials: "include",
    method: "DELETE"
  })
}

export async function updateArticle(id, article) {
  return fetch(BASE_URL + `/api/articles/${id}`, {
    mode: "cors",
    credentials: "include",
    method: "PUT",
    body: JSON.stringify(article),
    headers: { "Content-Type": "application/json" }
  }).then(a => a.json())
}

export async function getIndustries() {
  return fetch(BASE_URL + `/api/industries`, { headers: { "Content-Type": "application/json" } })
    .then(a => a.json())
}

export async function createIndustry(name) {
  return fetch(BASE_URL + `/api/industries`, {
    mode: "cors",
    credentials: "include",
    method: "POST",
    body: JSON.stringify({ content: name, count: 0 }),
    headers: { "Content-Type": "application/json" }
  }).then(a => a.json())
}

export async function deleteIndustry(id) {
  return fetch(BASE_URL + `/api/industries/${id}`, {
    mode: "cors",
    credentials: "include",
    method: "DELETE"
  })
}

export async function getCategories() {
  return fetch(BASE_URL + `/api/categories`, { headers: { "Content-Type": "application/json" } })
    .then(a => a.json())
}

export async function createCategory(name) {
  return fetch(BASE_URL + `/api/categories`, {
    mode: "cors",
    credentials: "include",
    method: "POST",
    body: JSON.stringify({ content: name, count: 0 }),
    headers: { "Content-Type": "application/json" }
  }).then(a => a.json())
}

export async function deleteCategory(id) {
  return fetch(BASE_URL + `/api/categories/${id}`, {
    mode: "cors",
    credentials: "include",
    method: "DELETE"
  })
}

export async function getAuthors() {
  return fetch(BASE_URL + `/api/authors`, { headers: { "Content-Type": "application/json" } })
    .then(a => a.json())
}

export async function createAuthor(name, imageID) {
  return fetch(BASE_URL + `/api/authors`, {
    mode: "cors",
    credentials: "include",
    method: "POST",
    body: JSON.stringify({ name, imageID }),
    headers: { "Content-Type": "application/json" }
  }).then(a => a.json())
}

export async function updateCategory(id, content) {
  return fetch(BASE_URL + `/api/categories/${id}`, {
    mode: "cors",
    credentials: "include",
    method: "PUT",
    body: JSON.stringify({ content }),
    headers: { "Content-Type": "application/json" }
  }).then(a => a.json())
}
export async function updateIndustry(id, content) {
  return fetch(BASE_URL + `/api/industries/${id}`, {
    mode: "cors",
    credentials: "include",
    method: "PUT",
    body: JSON.stringify({ content }),
    headers: { "Content-Type": "application/json" }
  }).then(a => a.json())
}
export async function updateAuthor(id, name, imageID) {
  return fetch(BASE_URL + `/api/authors/${id}`, {
    mode: "cors",
    credentials: "include",
    method: "PUT",
    body: JSON.stringify({ name, imageID }),
    headers: { "Content-Type": "application/json" }
  }).then(a => a.json())
}

export async function deleteAuthor(id) {
  return fetch(BASE_URL + `/api/authors/${id}`, {
    mode: "cors",
    credentials: "include",
    method: "DELETE"
  })
}



export async function putFormData(data) {
  return fetch(BASE_URL + "/api/images", {
    mode: "cors",
    credentials: "include",
    method: "PUT",
    body: data,
  }).then(a => a.json())
}

export async function deleteImage(id) {
  return fetch(`${BASE_URL}/api/images/${id}`, {
    mode: "cors",
    credentials: "include",
    method: "DELETE"
  }).then(a => a.json())
}

/*** TEMPIMAGES ELSE ***/
export async function getTempImages() {
  return fetch(`${BASE_URL}/api/tempimages`)
    .then(a => a.json())
    .then(a => a.map(a => a.id))
}
export async function postTempImage(id) {
  return fetch(`${BASE_URL}/api/tempimages/${id}`, {
    mode: "cors",
    credentials: "include",
    method: "POST"
  })
}
export async function deleteTempImage(id) {
  return fetch(`${BASE_URL}/api/tempimages/${id}`, {
    mode: "cors",
    credentials: "include",
    method: "DELETE"
  })
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

/*** SETTINGS ***/
export async function getSettings() {
  return fetch(`${BASE_URL}/api/settings`).then(a => a.json())
}

export async function setSettings(settings) {
  return fetch(`${BASE_URL}/api/settings`, {
    method: "PUT",
    body: JSON.stringify(settings),
    headers: {"Content-Type": "application/json"}
  })
}



