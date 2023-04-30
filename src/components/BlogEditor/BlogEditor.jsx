import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BlogEdit.css';
import { useNavigate, useParams } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:5000';

function Edit() {
  const [state, setState] = useState({
    title: '',
    subtitle: '',
    synopsis: '',
    author: '',
    content: '',
  });

  const { id } = useParams();
  const { title, subtitle, synopsis, author, content } = state;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/articles/${id}`);
        setState(data);
      } catch (error) {
        console.error(error);
        alert('Internal server error.');
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !content) {
      alert('Title and content are required.');
      return;
    }

    try {
      await axios.put(`/api/articles/${id}`, { title, subtitle, synopsis, author, content });
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Internal server error.');
    }
  };

  return (
    <div className="App">
      <header>
        <h1>IUCG Blog</h1>
      </header>
      <main>
        <section>
          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" value={title} onChange={handleChange} />
            <label htmlFor="subtitle">Subtitle</label>
            <input type="text" id="subtitle" name="subtitle" value={subtitle} onChange={handleChange} />
            <label htmlFor="synopsis">Synopsis</label>
            <textarea id="synopsis" name="synopsis" value={synopsis} onChange={handleChange}></textarea>
            <label htmlFor="content">Content</label>
            <textarea id="content" name="content" value={content} onChange={handleChange}></textarea>
            <label htmlFor="author">Author</label>
            <input type="text" id="author" name="author" value={author} onChange={handleChange} />
            <button type="submit">Save Changes</button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Edit;
