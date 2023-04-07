import "./MainPage.css";
import { useState, useEffect } from "react";
import { marked } from "marked";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { SmallArticleDisplay } from "../SmallArticleDisplay/SmallArticleDisplay";
import { Titlebar } from "../Titlebar/Titlebar"

axios.defaults.baseURL = "http://localhost:5000";

// This is the main page of the website. It displays all the articles in the database.
function MainPage() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

 // Fetches articles from the database
 const fetchArticles = async () => {
  try {
    const response = await axios.get("/api/articles");
    const articlesWithPhotos = await Promise.all(response.data.map(async (article) => {
      const photoResponse = await axios.get("https://dog.ceo/api/breeds/image/random");
      return {
        ...article,
        photoUrl: photoResponse.data.message,
      };
    }));
    setArticles(articlesWithPhotos);
  } catch (error) {
    console.error(error);
  }
}

  // This function render the markdown to html. Not currently used.
  // May be useful for later
  const handleMarkdown = (content) => {
    return { __html: marked(content) };
  };

  // This function deletes an article from the database
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/articles/${id}`);
      setArticles((prevState) =>
        prevState.filter((article) => article._id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Internal server error.");
    }
  };

  const navigateToCreate = () => {
    navigate("../../create");
  };

  // This function renders the articles to the page, use the SmallArticleDisplay component
  return (
    <div className="mainpage">
    <Titlebar/>
      <div className="articles">
        {articles.map((article) => (
          <div key={article._id}>
            <SmallArticleDisplay
              article={article}
            />
            <button class="button-3" role="button" onClick={() => handleDelete(article._id)}> 
              Delete Article
            </button>
          </div>
        ))}
      </div>
      <button class="button-6" role="button" onClick={navigateToCreate}> 
        Create Article 
      </button>
    </div>
  );
}
export default MainPage;
