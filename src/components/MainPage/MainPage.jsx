import "./MainPage.css";
import { useState, useEffect } from "react";
import SmallArticleDisplay from "../SmallArticleDisplay/SmallArticleDisplay";
import Titlebar from "../Titlebar/Titlebar"
import { getArticles } from "../../api"


// This is the main page of the website. It displays all the articles in the database.
export default function MainPage() {
  const [articles, setArticles] = useState([]);

  //get articles
  useEffect(()=>{getArticles().then(setArticles)}, []);

  return <div className="mainpage">
      <Titlebar/>
      <div className="articles">
        {articles.map((article) => <SmallArticleDisplay article={article} key={article._id}/> )}
      </div>
    </div>
}
