import "./BlogDisplay.css"
import "../../common.css"
import { useState, useEffect } from "react";
import React from "react";
import { Remarkable } from "remarkable"
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation.jsx"
import SmallerArticleDisplay from "../SmallerArticleDisplay/SmallerArticleDisplay.jsx"
import { getArticle, getArticles } from "../../api"

const md = new Remarkable();

export default function BlogDisplay({ id }) {
  const [article, setArticle] = useState({
    title: null,
    author: null,
    authorImg: null,
    content: null,
    contentImg: null,
    subtitle: null
  })
  
  useEffect(()=>{getArticle(id).then(setArticle)}, [])

  return <div className="blogdisplay" style={{position: "relative"}}>
    <Image src={article.contentImg}/>
    <div className="contentcontainer">
      <div className="content">
        <Title title={article.title}/>
        <Author author={article.author} authorImg={article.authorImg}/>
        <Content markdown={md.render(article.content)}/>
      </div>
      <ReadMore/>
    </div>
  </div>
}

function Image({ src }) {
  var [loading, setLoading] = useState(true)
  function onload() { setLoading(false) }

  return <div className="imagecontainer">
      <div className="center-content" style={{display: loading || !src ? "" : "none"}}><LoadingAnimation/></div>
      <img src={src} onLoad={onload} style={{height: "100%", width: "100%", objectFit: "cover", display: loading || !src ? "none" : ""}}></img>
  </div>
}

function Content({ markdown }) {
  return !markdown ?
      <div className="center-content" style={{height: "100%"}}><LoadingAnimation/></div> :
      <div dangerouslySetInnerHTML={{ __html: markdown }}></div>
}

function Title({ title }) {
  return <div className="title">{title}</div>
}

function Author({ author, authorImg }) {
  return <div className="author">
      <img className="authorimg" src={authorImg}/>
      <div className={"authortext center-content"}>{author}</div>
    </div>
}

function ReadMore() {
  const [articles, setArticles] = useState([])
  //TODO: get random articles instead of first 5 or try to get similar ones
  useEffect(()=>{getArticles().then(a=>setArticles(a.slice(0, 5)))}, [])
  
  return <div className="readmore">{ articles.map(article => <SmallerArticleDisplay article={article} key={article._id}/>) }</div>
}
