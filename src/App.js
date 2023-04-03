import React from 'react';
import axios from 'axios';
import {marked} from 'marked';
import './index.css';
import { BrowserRouter, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage.jsx';

axios.defaults.baseURL = 'http://localhost:5000';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: '', subtitle:'', synopsis:'', author:'', content: '', articles: [] };
  }

  componentDidMount() {
    this.fetchArticles();
  }

  fetchArticles = async () => {
    try {
      const response = await axios.get('/api/articles');
      this.setState({ articles: response.data });
    } catch (error) {
      console.error(error);
    }
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({ ...prevState, [name]: value }));
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { title, subtitle, synopsis, author, content} = this.state;
    if (!title || !content) {
      alert('Title and content are required.');
      return;
    }

    try {
      const { data } = await axios.post('/api/articles', 
      { title, subtitle, synopsis, author, content });
      this.setState((prevState) => ({ articles: [...prevState.articles, data], 
        title: '', subtitle: '', synopsis: '', author: '', content: '' }));
      console.log(data)
    } catch (error) {
      console.error(error);
      alert('Internal server error.');
    }
  };

  handleMarkdown = (content) => {
    return { __html: marked(content) };
  };

  handleDelete = async (id) => {
    try {
      await axios.delete(`/api/articles/${id}`);
      this.setState((prevState) => ({ articles: prevState.articles.filter((article) => article._id !== id) }));
    } catch (error) {
      console.error(error);
      alert('Internal server error.');
    }
  };

  render() {
    const { title, subtitle, synopsis, author, content, articles } = this.state;

    return (
      <div className="App">
        <header>
          <h1>IUCG Blog</h1>
        </header>
        <main>
          <section>
            <form onSubmit={this.handleSubmit}>
              <label htmlFor="title">Title</label>
              <input type="text" id="title" name="title" value={title} onChange={this.handleChange} />
              <label htmlFor="subtitle">Subtitle</label>
              <input type="text" id="subtitle" name="subtitle" value={subtitle} onChange={this.handleChange} />
              <label htmlFor="synopsis">Synopsis</label>
              <textarea id="synopsis" name="synopsis" value={synopsis} onChange={this.handleChange}></textarea>
              <label htmlFor="content">Content</label>
              <textarea id="content" name="content" value={content} onChange={this.handleChange}></textarea>
              <label htmlFor="author">Author</label>
              <input type="text" id="author" name="author" value={author} onChange={this.handleChange} />
              <button type="submit">Submit</button>
            </form>
          </section>
          <section>
            {articles.map((article) => (
              <article key={article._id}>
                <h2>{article.title}</h2>
                <h3>{article.subtitle}</h3>
                <h4>{article.synopsis}</h4>
                <h5>{article.author}</h5>
                <div dangerouslySetInnerHTML={this.handleMarkdown(article.content)}></div>
                <button onClick={() => this.handleDelete(article._id)}>Delete</button>
              </article>
            ))}
          </section>
        </main>
      </div>
    );
  }
}


export default App;

// export default App;
