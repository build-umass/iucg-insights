import "./BlogDisplay.css"
import "../../common.css"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import { Remarkable } from "remarkable"
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation.jsx"
import SmallerArticleDisplay from "../SmallerArticleDisplay/SmallerArticleDisplay.jsx"
import { BASE_URL, getArticle, getArticles } from "../../api"

const md = new Remarkable();

export default function BlogDisplay() {
  const { id } = useParams()
  
  const [article, setArticle] = useState({
    title: "",
    authorIDs: [],
    content: "",
    contentImgID: "",
  })
  console.log(article)
  
  useEffect(()=>{getArticle(id).then(setArticle)}, [])

  return <div className="blogdisplay" style={{position: "relative"}}>
    <Image src={article.contentImgID}/>
    <div className="content">
      <Title title={article.title}/>
      <Author author={article.author} src={article.authorImgID}/>
      <Content markdown={md.render(article.content)}/>
      <ReadMore/>
    </div>
  </div>
}

function Image({ src }) {
  var [loading, setLoading] = useState(true)

  return <div className="imagecontainer">
      <div className="center-content" style={{display: loading || !src ? "" : "none"}}><LoadingAnimation/></div>
      <img src={src ? BASE_URL+`/api/images/${src}` : ""} onLoad={() => setLoading(false)} style={{height: "100%", width: "100%", objectFit: "cover", display: loading || !src ? "none" : ""}}></img>
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

function Author({ author, src }) {
  return <div className="author">
      <img className="authorimg" src={src ? BASE_URL+`/api/images/${src}` : ""}/>
      <div className={"authortext center-content"}>{author}</div>
    </div>
}

function ReadMore() {
  const [articles, setArticles] = useState([])
  //TODO: get random articles instead of first 5 or try to get similar ones
  useEffect(()=>{getArticles().then(a=>setArticles(a.slice(0, 5)))}, [])
  
  return <div className="readmore">{ articles.map(article => <SmallerArticleDisplay article={article} key={article._id}/>) }</div>
}
