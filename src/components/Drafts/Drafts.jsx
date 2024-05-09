import { getHiddenArticles, setArticlePublish, deleteArticle } from "../../api"
import { useEffect, useState } from "react"
import { ScrollRestoration, useNavigate } from "react-router-dom"
import "./Drafts.css"

export default function Drafts() {

  const [articles, setArticles] = useState([])
  useEffect(() => {
    getHiddenArticles()
      .then(a => a.sort((a, b) => a.published > b.published ? 1 : -1))
      .then(setArticles)
  }, [])
  useEffect(() => console.log(articles), [articles])

  return <>
      <h1>articles</h1>
      { articles.map(article => <ArticleListItem key={article._id} article={article} articles={articles} setArticles={setArticles}/>) }
      <ScrollRestoration/>
    </>
}

function ArticleListItem({ article, articles, setArticles }) {

  const navigate = useNavigate()
  function onToggleHidden() {
    setArticles(articles.map(a => a._id != article._id ? a : { ...a, published: !a.published}))
    setArticlePublish(article._id, !article.published)
  }
  function onDelete() {
    setArticles(articles.filter(({_id}) => _id != article._id))
    deleteArticle(article._id)
  }
  
  return <div className="draftrow">
      <span>{article.title}</span>
      <span
        onClick={onToggleHidden}
        className={`material-symbols-outlined${article.published ? "" : " unpublished"}`}>
        {article.published ? "visibility" : "visibility_off"}
      </span>
      <span className="material-symbols-outlined" onClick={()=>navigate(`/create/${article._id}`)}>edit</span>
      <span className="material-symbols-outlined" onClick={onDelete}>delete</span>
    </div>
}

