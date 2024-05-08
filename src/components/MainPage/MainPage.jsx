import "./MainPage.css";
import { useState, useEffect } from "react";
import SmallArticleDisplay from "../SmallArticleDisplay/SmallArticleDisplay";
import Titlebar from "../Titlebar/Titlebar"
import { getArticles, deleteArticle } from "../../api"
import IUCGFooter from "../IUCGFooter/IUCGFooter";
import SearchSection from "../SearchSection/SearchSection";
import SearchPage from "../SearchPage/SearchPage";
import FeaturedInsights from "../FeaturedInsights/FeaturedInsights";
import "../../common.css"

// This is the main page of the website. It displays all the articles in the database.
export default function MainPage() {
 
  return <div className="mainpage">
    <Titlebar/>

    <div className="hero-banner">
      <h1>IUCG INSIGHTS</h1>
      At IUCG we value the insights we gain through industry experience.
      Below you can view our Industry Reports, Case Studies, and Client Projects.
      We hope you enjoy learning about our insights.
    </div>

    <FeaturedInsights></FeaturedInsights>

      <SearchSection />

      <IUCGFooter />
  </div>
}
