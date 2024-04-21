import "./MainPage.css";
import { useState, useEffect } from "react";
import SmallArticleDisplay from "../SmallArticleDisplay/SmallArticleDisplay";
import Titlebar from "../Titlebar/Titlebar"
import { getArticles, deleteArticle } from "../../api"
import IUCGFooter from "../IUCGFooter/IUCGFooter";
import SearchSection from "../SearchSection/SearchSection";
import SearchPage from "../SearchPage/SearchPage";
import FeaturedInsights from "../FeaturedInsights/FeaturedInsights";

// This is the main page of the website. It displays all the articles in the database.
export default function MainPage() {
  /** @type {[any, (x: any) => void]} */
  const [articles, setArticles] = useState([]);

  //get articles
  useEffect(() => { getArticles().then(setArticles) }, []);

  //our delete callback
  function remove(article) {
    deleteArticle(article._id).then(
      res => {
        if (res.status === 200)
          setArticles(articles.filter(a => a !== article))
      }
    )
  }

  return <div className="mainpage">
    <Titlebar setArticles={setArticles} />

    <div className="hero-banner">
      <h1>IUCG INSIGHTS</h1>
      At IUCG we value the insights we gain through industry experience.
      Below you can view our Industry Reports, Case Studies, and Client Projects.
      We hope you enjoy learning about our insights.
      <div className="linkedin-logo">
        <a href="https://www.linkedin.com/company/iucg/" />
      </div>
    </div>

    <FeaturedInsights></FeaturedInsights>

    <SearchSection articles={articles} removeCallBack={article => remove(article)} />

    <IUCGFooter />
  </div>
}
