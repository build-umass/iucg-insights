import React, { useState } from 'react';
import axios from 'axios';
import './Create.css';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:5000';

function Create() {
  const [state, setState] = useState({
    title: '',
    subtitle: '',
    synopsis: '',
    author: '',
    content: '',
    articles: [],
  });
	
  const [imgstate, setImgState] = useState({
    url: '',
    data: '',
    type: '',
  });

  const { title, subtitle, synopsis, author, content, articles } = state;
  const { url, data, type } = imgstate;
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpload = (event) => {
    const { name, value, files } = event.target;
    setImgState({ [name]: value, data: files[0].name, type: files[0].type });
  };

  // call handleSubmit when the form is submitted
  const handleSubmit = async (event) => {  
    event.preventDefault();
    if (!title || !content) {
      alert('Title and content are required.');
      return;
    }

    try {
      const imgres = await axios.post('/api/images',
      { url, data, type});
      setImgState(() => ({ url: '', data: '', type: ''}));
      //const contentImg = await axios.get(`/api/images/${imgres.data._id}`);
      let getid;
      if (imgres.data._id) {
        getid = imgres.data;
      } else {
        getid = await axios.get(`/api/images/${imgres.data}`);
	getid = getid.data;
      }
      console.log(getid);
      const contentImg = getid._id;
      const { log } = await axios.post('/api/articles',
      { title, subtitle, synopsis, author, content, contentImg});
      setState((prevState) => ({ articles: [...prevState.articles, log],
        title: '', subtitle: '', synopsis: '', author: '', content: '' }));
      console.log(log)
    
      // Navigate to main page
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
	    <label htmlFor="url">Cover Image</label>
	    <input type="file" id="url" name="url" accept="image/*" value={url} onChange={handleUpload}/>
            <button type="submit">Submit</button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Create;
