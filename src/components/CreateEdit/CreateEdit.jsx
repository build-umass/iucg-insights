import "./CreateEdit.css"
import "../../common.css"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import { Remarkable } from "remarkable"
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation.jsx"
import { getArticle } from "../../api"

import TextareaAutosize from 'react-textarea-autosize';

const md = new Remarkable();

export default function BlogDisplay() {
  const { id } = useParams()
  if (!id) console.log("making new") //TODO: create new id later??
  
  const [article, setArticle] = useState({
    title: "",
    subtitle: "",
    synopsis: "",
    author: "",
    authorImageID: "",
    content: "",
    contentImgID: "",
    images: []
  })
  const [images, setImages] = useState([])
  const [markdown, setMarkdown] = useState("")
  
  if (id) useEffect(async () => {
    setArticle(await getArticle(id))
    setImages([ article.authorImageID, article.contentImgID ])
  }, [])

  const buildparam = ParamEditFactory(article, setArticle)
  const buildlarger = LargerEditFactory(article, setArticle)

  return <div className="createedit" style={{position: "relative"}}>
    <ContentImageEdit />
    <AuthorImageEdit />
    { [ "title",
        "author",
        "content",
      ].map(buildparam) }
    { [ "subtitle",
        "synopsis"
      ].map(buildlarger) }
    <ImagesEdit />
    <MarkdownEdit />
  </div>
}

function Content({ markdown }) {
  return !markdown ?
      <div className="center-content" style={{height: "100%"}}><LoadingAnimation/></div> :
      <div dangerouslySetInnerHTML={{ __html: markdown }}></div>
}

function ParamEditFactory(article, setArticle) {
  return param => ParamEdit({ param, article, setArticle })
}

function ParamEdit({ param, article, setArticle }) {
  return <>
        <label for={param}>{param}</label>
        <input name={param} value={article[param]} onChange={e => { 
          setArticle(Object.defineProperty(article, param, {
            value: e.target.value,
            enumerable: true
          }))
        }}/>
      </>
}

function LargerEditFactory(article, setArticle) {
  return param => LargerEdit({ param, article, setArticle })
}

function LargerEdit({ param, article, setArticle }) {
  return <>
        <label for={param}>{param}</label>
        <TextareaAutosize minRows="4" name={param} value={article[param]} onChange={ e => {
          setArticle(Object.defineProperty(article, param, {
            value: e.target.value,
            enumerable: true
          }))
        }}/>
      </>
}



