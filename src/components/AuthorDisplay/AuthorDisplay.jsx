import "./AuthorDisplay.css"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAuthor, searchArticle, BASE_URL } from "../../api"
import SearchPageArticle from "../SearchPageArticle/SearchPageArticle";
import Titlebar from "../Titlebar/Titlebar"

import { marked } from "marked"
import { pdfrender } from "../../pdf-marked"
import IUCGFooter from "../IUCGFooter/IUCGFooter";
marked.use({ extensions: [pdfrender] })

export default function AuthorDisplay() {
  const { id } = useParams()
  const [author, setAuthor] = useState({
    name: "",
    imageID: "",
    content: ""
  })
  const [articles, setArticle] = useState([])

  useEffect(() => {
    getAuthor(id).then(a => {
      setAuthor(a)
      searchArticle(undefined, undefined, undefined, [a.name])
        .then(setArticle)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let articleList = articles.map((article, key) =>
    <SearchPageArticle
      article={article}
      key={key}
    ></SearchPageArticle>);
  return <>
    <Titlebar></Titlebar>
    <div class="outer-wrapper">
      <div class="author-page-content">
        <div className="author-card">
          <img
            alt={author.name}
            src={`${BASE_URL}/api/images/${author.imageID}`}
            className="author-profile-picture"
          />
          <div className="author-name">{author.name}</div>
        </div>
        <div class="author-blurb" dangerouslySetInnerHTML={{ __html: marked.parse(author.content) }}></div>
      </div>
      {articleList}
    </div>
    <IUCGFooter></IUCGFooter>
  </>
}




