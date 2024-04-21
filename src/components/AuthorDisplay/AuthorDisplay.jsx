import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAuthor, searchArticle, BASE_URL } from "../../api"
import SearchPageArticle from "../SearchPageArticle/SearchPageArticle";

import { marked } from "marked"
import { pdfrender } from "../../pdf-marked"
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

  return <>
      <img alt="author's pfp" src={author.imageID && `${BASE_URL}/api/images/${author.imageID}`}/>
      <div>{author.name}</div>
      <div dangerouslySetInnerHTML={{__html: marked.parse(author.content)}}></div>

      { articles.map(article => <SearchPageArticle key={article._id} article={article}/>) }
    </>}




