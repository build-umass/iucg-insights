import "./BlogDisplay.css"
import "../../common.css"
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation.jsx"
import SmallerArticleDisplay from "../SmallerArticleDisplay/SmallerArticleDisplay.jsx"
import { BASE_URL, getArticle, getArticles } from "../../api"

import { marked } from "marked"
import { pdfrender } from "../../pdf-marked"
import Titlebar from "../Titlebar/Titlebar.jsx";
import SmallArticleDisplay from "../SmallArticleDisplay/SmallArticleDisplay.jsx";
import IUCGFooter from "../IUCGFooter/IUCGFooter.jsx";

marked.use({ extensions: [pdfrender] })

export default function BlogDisplay() {
  const { id } = useParams()

  const [article, setArticle] = useState({
    title: "",
    author: "",
    authorID: "",
    authorImgID: "",
    content: "",
    contentImgID: "",
    created: "",
  })
  console.log(article)

  useEffect(() => { getArticle(id).then(setArticle) }, [id])

  return <div className="blogdisplay">
    <Titlebar></Titlebar>
    <div className="content">
      <Title title={article.title} />
      <Author author={article.author} authorID={article.authorID}/>
      <DateIndicator date={article.created}></DateIndicator>
      <Image src={article.contentImgID} title={article.title} />
      <Content markdown={marked.parse(article.content)} />
    </div>
    <ReadMore />
    <IUCGFooter></IUCGFooter>
  </div>
}

function Image({ src, title }) {
  return <img
    className="hero-image"
    src={`${BASE_URL}/api/images/${src}`}
    alt={title}
  ></img>
}

function Content({ markdown }) {
  return !markdown ?
    <div className="center-content"><LoadingAnimation /></div> :
    <div className="blog-content" dangerouslySetInnerHTML={{ __html: markdown }}></div>
}

function Title({ title }) {
  return <h1 className="title">{title}</h1>
}

function Author({ author, authorID }) {
  const navigate = useNavigate();
  return <div className="author" onClick={() => navigate(`/authors/${authorID}`)}>
    by {author}
  </div>
}

function DateIndicator({ date }) {
  return <div className="date-label">
    {new Date(date).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}
  </div>
}

function ReadMore() {
  const [articles, setArticles] = useState([])
  useEffect(() => { getArticles().then(a => setArticles(a.slice(0, 5))) }, [])

  const componentList = articles
    .map(article =>
      <SmallArticleDisplay
        article={article}
        key={article._id}
        removeCallback={() => { }} />
    )
  return <div className="readmore">
    <h2>More Like This</h2>
    <div className="container">
      {componentList}
    </div>
  </div>
}
