import { getHiddenArticles, setArticlePublish, deleteArticle } from "../../api"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Drafts() {

  const [articles, setArticles] = useState([])
  useEffect(() => {
    getHiddenArticles().then(setArticles)
  }, [])
  

  return <>
      <h1>articles</h1>
      { articles.map(article => <ArticleListItem key={article._id} article={article} articles={articles} setArticles={setArticles}/>) }
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
  
  return <div>
      {article.title}
      <button onClick={onDelete}>delete</button>
      <button onClick={onToggleHidden}>{article.published ? "unpublish" : "publish"}</button>
      <button onClick={()=>navigate(`/create/${article._id}`)}>edit</button>
    </div>
}

