import "./BlogDisplay.css"
import "../../common.css"
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import ContentEditable from 'react-contenteditable';
import { Remarkable } from "remarkable"
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation.jsx"
import SmallerArticleDisplay from "../SmallerArticleDisplay/SmallerArticleDisplay.jsx"
import AdminButtons from "../AdminButtons/AdminButtons"
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

  const [article, setArticle] = useState({
    title: null,
    author: null,
    authorImg: null,
    content: null,
    contentImg: null,
    subtitle: null 
  })
  //keeps track of old article in the event of cancelling
  const [oldArticle, setOldArticle] = useState(article)
  
  const [html, setHTML] = useState("")
  const [editing, setEditing] = useState(false)

  //get inintial state of article via API and html via article
  useEffect(()=>{getArticle(id).then(setArticle)}, [])
  useEffect(()=>{
    setHTML(toHTML(article.content || ""))
    setOldArticle(article)
  }, [editing])
  
  function saveCallback() {
    setEditing(false)
    updateArticle(id, article)
  }
  function cancelCallback() {
    setEditing(false)
    setArticle(oldArticle)
  }

  //once we've created all our components we can actually render our thing
  return <>
    <AdminButtons id={id}
      editing={editing}
      editCallback={()=>setEditing(true)}
      cancelCallback={cancelCallback}
      saveCallback={saveCallback}/>
    <div className="blogdisplay" style={{position: "relative"}}>
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
        {!editing ? <ReadMore/> : null}
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


