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
    articles: []
  });

  const [input, setInput] = useState('');
  const [tags, setTags] = useState([]);
  const [isKeyReleased, setIsKeyReleased] = useState(false);

  const { title, subtitle, synopsis, author, content, articles } = state;
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const onChange = (e) => {
    const { value } = e.target;
    setInput(value);
  };

  // call handleSubmit when the form is submitted
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !content) {
      alert('Title and content are required.');
      return;
    }

    try {
      const { data } = await axios.post('/api/articles',
        { title, subtitle, synopsis, author, content, tags });
      console.log(tags)

      const separatedTags = tags.map(tag => ({ content: tag }));

      // Post each tag individually to the tags collection
      for (const tag of separatedTags) {
        try {
          await axios.post('/api/tags', { content: tag.content });
          console.log(`Tag "${tag.content}" added to tags collection`);
        } catch (error) {
          console.error(`Failed to add tag "${tag.content}"`, error);
        }
      }

      setState((prevState) => ({
        articles: [...prevState.articles, data],
        title: '', subtitle: '', synopsis: '', author: '', content: '', tags: []
      }));
      console.log(data)

      // Navigate to main page
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Internal server error.');
    }
  };

  // ----handle tags input-----
  const onKeyDown = (e) => {
    const { key } = e;
    const trimmedInput = input.trim();

    if (key === ',' && trimmedInput.length && !tags.includes(trimmedInput)) {
      e.preventDefault();
      setTags(prevState => [...prevState, trimmedInput]);
      setInput('');
    }

    if (key === "Backspace" && !input.length && tags.length && isKeyReleased) {
      const tagsCopy = [...tags];
      const poppedTag = tagsCopy.pop();
      e.preventDefault();
      setTags(tagsCopy);
      setInput(poppedTag);
    }

    setIsKeyReleased(false);
  };

  const onKeyUp = () => {
    setIsKeyReleased(true);
  }

  const deleteTag = (index) => {
    setTags(prevState => prevState.filter((tags, i) => i !== index))
  }
  // ----handle tags input-----


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
            <div>
              {tags.map((tags, index) => (
                <div className="tag">
                  {tags}
                  <button onClick={() => deleteTag(index)}>x</button>
                </div>
              ))}
              <input
                value={input}
                placeholder="Enter a tag"
                onKeyDown={onKeyDown}
                onChange={onChange}
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Create;
