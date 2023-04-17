import "./MainPage.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SmallArticleDisplay from "../SmallArticleDisplay/SmallArticleDisplay";
import Titlebar from "../Titlebar/Titlebar"
import { getArticles, deleteArticle } from "../../api"


// This is the main page of the website. It displays all the articles in the database.
export default function MainPage() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  //get articles
  useEffect(()=>{getArticles().then(setArticles)}, []);

  //attempt to delete article--when successful, remove article
  const handleDelete = (id) => deleteArticle(id).then(()=>setArticles((a) => a.filter(b=>b._id !== id)))  

  return <div className="mainpage">
    <Titlebar/>
    <div className="articles">
      {articles.map((article) =>
        <div key={article._id}>
          <SmallArticleDisplay
            article={article}
          />
          <button className="button-3" role="button" onClick={() => handleDelete(article._id) }> 
            Delete Article
          </button>
        </div>
      )}
    </div>
    <button className="button-6" role="button" onClick={() => navigate("/create")}> 
      Create Article 
    </button>
    </div>
}
