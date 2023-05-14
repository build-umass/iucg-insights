import "./BlogDisplay.css"
import "../../common.css"
import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import ContentEditable from 'react-contenteditable';
import { Remarkable } from "remarkable"
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation.jsx"
import SmallerArticleDisplay from "../SmallerArticleDisplay/SmallerArticleDisplay.jsx"
import { getArticle, getArticles, updateArticle } from "../../api"

const md = new Remarkable();

//functions for converting to and from html
const toHTML=str=>str.includes("\n") ? str
    .replaceAll(/(.*?)\n|(.+?)$|(?<=\n)()$/g,"<div>$1$2<br></div>")
    .replace(/(.*?)<br>/, "$1")
    : str
const fromHTML=str=>str
  .replaceAll(/<div>(.*?)<\/div>/g, "\n$1")
  .replaceAll(/<br>/g, "")
  .replace(/^\n/, "")
  .replace(/&lt;/, "<")
  .replace(/&gt;/, ">")

export default function BlogDisplay() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const editing = location.state ? location.state.edit : false

  const [article, setArticle] = useState({
    title: "",
    author: "",
    authorImg: "",
    content: "",
    contentImg: "",
    subtitle: "" 
  })
  
  const [html, setHTML] = useState("")
  // const [editing, setEditing] = useState(false)

  //get inintial state of article via API and html via article
  useEffect(()=>{getArticle(id).then(article => {
    setArticle(article)
    setHTML(toHTML(article.content))
  })}, [])

  //once we've created all our components we can actually render our thing
  return <>
    <div className="blogdisplay" style={{position: "relative"}}>
      <div className="buttons" style={{zIndex: editing ? 3 : 1}}>
        <div onClick={()=>{navigate("/")}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
        </div>
        {editing && <div onClick={()=>{updateArticle(id, article);navigate("/")}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
        </div>}
      </div>
      <Image src={article.contentImg}/>
      <div className={`contentcontainer ${editing ? "editing" : ""}`}>
        <div className="content">
          <Title article={article} editing={editing}
            handleChange={e=>setArticle({...article, title: e.target.value})}/>
          <Author article={article} editing={editing}
            handleChange={e=>setArticle({...article, author: e.target.value})}/>
          <Content
            article={article} setArticle={setArticle}
            html={html} setHTML={setHTML}
            editing={editing}/>
        </div>
        {!editing && <ReadMore/>}
      </div>
    </div>
  </>
}

/* Image component
 * displays image or loading animation
 * TODO: make work for authorimg
 * TODO: use custom images
 */
function Image({ src }) {
  var [loading, setLoading] = useState(true)
  function onload() { setLoading(false) }

  return <div className="imagecontainer">
      <div className="center-content" style={{display: loading || !src ? "" : "none"}}><LoadingAnimation/></div>
      <img src={src} onLoad={onload} style={{height: "100%", width: "100%", objectFit: "cover", display: loading || !src ? "none" : ""}}></img>
  </div>
}

function Title({article, editing, handleChange}) {
  return <ContentEditable
      className="title"
      html={article.title}
      disabled={!editing}
      onChange={handleChange}/>
}

/* Content component
 * Contains blog content and editing window
 */
function Content({article, setArticle, html, setHTML, editing}) {
  //are we previewing
  const [preview, setPreview] = useState(true)
  useEffect(()=>{})
  
  const editref = useRef(null)
  function handleChange(e) {
    setHTML(e.target.value)
    setArticle({...article, content: fromHTML(e.target.value)})
  }
  
  return <>{editing ? <>
      <div className="buttoncontainer">
        <button className={preview ? "selected" : null} onClick={()=>setPreview(true)}>Preview</button>
        <button className={preview ? null : "selected"} onClick={()=>setPreview(false)}>Edit</button>
      </div>
      <ContentEditable
        className="editwindow"
        style={{display: preview ? "none" : null}}
        innerRef={editref}
        html={html}
        onChange={handleChange}/>
      </> : null}
      <div style={{display: preview || !editing ? null : "none"}}>
        {!article.content ?
          <div className="center-content" style={{height: "100%"}}><LoadingAnimation/></div> :
          <div dangerouslySetInnerHTML={{ __html: md.render(article.content)}}></div>}
      </div>
    </>  
}


function Author({article, editing, handleChange}) {

  return <div className="author">
      <img className="authorimg" src={article.authorImg}/>
      <ContentEditable
        className={"authortext center-content"}
        html={article.author}
        disabled={!editing}
        onChange={handleChange} />
    </div>
}


function ReadMore() {
  const [articles, setArticles] = useState([])
  //TODO: get random articles instead of first 5 or try to get similar ones
  useEffect(()=>{getArticles().then(a=>setArticles(a.slice(0, 5)))}, [])

  return <div className="readmore">{ articles.map(article => <SmallerArticleDisplay article={article} key={article._id}/>) }</div>
}


