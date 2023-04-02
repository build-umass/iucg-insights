import React, { useState, useEffect } from "react";
import axios from "axios";
import {marked} from "marked";
import "./index.css";
axios.defaults.baseURL = 'http://localhost:5000';

function App() {
  const [state, setState] = useState({ title: "", content: "" });
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await axios.get('/articles');
        setArticles(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchArticles();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { title, content } = state;
    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    try {
      const { data } = await axios.post("/api/articles", { title, content });
      setArticles((prevState) => [...prevState, data]);
      setState({ title: "", content: "" });
    } catch (error) {
      console.error(error);
      alert("Internal server error.");
    }
  };

  const handleMarkdown = (content) => {
    return { __html: marked(content) };
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/articles/${id}`);
      setArticles((prevState) => prevState.filter((article) => article._id !== id));
    } catch (error) {
      console.error(error);
      alert("Internal server error.");
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Markdown Blog</h1>
      </header>
      <main>
        <section>
          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={state.title}
              onChange={handleChange}
            />
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={state.content}
              onChange={handleChange}
            ></textarea>
            <button type="submit">Submit</button>
          </form>
        </section>
        <section>
          {articles.map((article) => (
            <article key={article._id}>
              <h2>{article.title}</h2>
              <div
                dangerouslySetInnerHTML={handleMarkdown(article.content)}
              ></div>
              <button onClick={() => handleDelete(article._id)}>Delete</button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
