import "./MainPage.css";
import { useState, useEffect } from "react";
import { marked } from "marked";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { SmallArticleDisplay } from "../SmallArticleDisplay/SmallArticleDisplay";

axios.defaults.baseURL = "http://localhost:5000";

function MainPage() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get("/api/articles");
      setArticles(
        response.data.map((article) => ({
          ...article,
          photoUrl: `https://dog.ceo/api/breeds/image/random`,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkdown = (content) => {
    return { __html: marked(content) };
  };

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

  const navigateToApp = () => {
    navigate("../../app");
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "400px 400px" }}>
        {articles.map((article) => (
          <SmallArticleDisplay
            article={article}
            key={article._id}
            photoUrl={article.photoUrl}
          />
        ))}
      </div>
      <button onClick={navigateToApp}>
        Create Article
      </button>
    </div>
  );
}

export default MainPage;
