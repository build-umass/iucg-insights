import "./MainPage.css";
import { useState, useEffect } from "react";
import SmallArticleDisplay from "../SmallArticleDisplay/SmallArticleDisplay";
import Titlebar from "../Titlebar/Titlebar"
import ArticleSearchBar from "../ArticleSearchBar/ArticleSearchBar"
import { getArticles, deleteArticle } from "../../api"

// This is the main page of the website. It displays all the articles in the database.
export default function MainPage() {
  const [articles, setArticles] = useState([]);

  //get articles
  useEffect(()=>{getArticles().then(setArticles)}, []);
  
  //our delete callback
  function remove(article) {
    setArticles(articles.filter(a=>a!=article))
    deleteArticle(article._id)
  }

  return <div className="mainpage">
      <Titlebar setArticles={setArticles}/>
      <div className="articles">
        {articles.map((article) =>
          <SmallArticleDisplay
            article={article}
            key={article._id}
            removeCallback={()=>remove(article)}/>
        )}
      </div>
    </div>
}
