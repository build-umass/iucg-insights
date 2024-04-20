import { getHiddenArticles, setArticlePublish, deleteArticle } from "../../api"
import { useEffect, useState } from "react"


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

  async function onToggleHidden() {
    setArticlePublish(article._id, !article.published)
    setArticles(articles.map(a => a._id != article._id ? a : { ...a, published: !a.published}))
  }
  async function onDelete() {
    setArticles(articles.fitler(({_id}) => _id != article._id))
    await deleteArticle(article._id)
  }
  
  return <div>
      {article.title}
      <button onClick={onDelete}>delete</button>
      <button onClick={onToggleHidden}>{article.published ? "unpublish" : "publish"}</button>
    </div>
}

