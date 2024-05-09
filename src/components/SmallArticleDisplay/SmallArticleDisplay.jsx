import "./SmallArticleDisplay.css"
import "../../common.css"
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation"
import { BASE_URL } from "../../api.js"

export default function SmallArticleDisplay({ article }) {
  const navigate = useNavigate()
  
  const dropdown = useRef(null);
  const dotdotdot = useRef(null);
  const [hide, setHide] = useState(true);
  //subscribe state of dropdown and dotdotdot to hide
  useEffect(()=>{
    if (!dropdown.current || !dotdotdot.current) return;
    if (hide) {
      dropdown.current.classList.add("hide")
      dotdotdot.current.classList.remove("show")
    } else {
      dropdown.current.classList.remove("hide")
      dotdotdot.current.classList.add("show")
    }
  }, [hide])
  
  //add global onclick for hiding stuff
  function onclick(event) {
    if (event.target.parentElement === dropdown) return;
    setHide(true)
  }
  window.addEventListener("click", onclick)
  useEffect(()=>()=>window.removeEventListener("click", onclick)) //cleanup
  const createdDate = new Date(article.created);
  
  const navArticle=()=>navigate(`/articles/${article._id}`)
  const navAuthor=()=>navigate(`/authors/${article.authorID}`)
      
  return <div className="smallarticledisplaycontainer">
    <Image onClick={navArticle} src={article.contentImgID}/>
    <div className="textcontainer">
      <div className="tags">
        {article.categories.map((tag, index) => (
          <span key={index}>{tag+'   '}</span>
        ))}
      </div>
      <div className="title" onClick={navArticle}>{article.title}</div>
      <div className="author" onClick={navAuthor}>By {article.author}</div>
      <div className="date">{createdDate.toLocaleString('en-EN', { year: "numeric", month: "long", day: "numeric" })}</div>

    </div>
  </div>
}
// this function renders the image for the article
function Image({ src, onClick }) {
  const [loading, setLoading] = useState(true);

  return <div className="imagecontainer" onClick={onClick}>
    <div className="center-content" style={{ display: loading || !src ? "" : "none" }}><LoadingAnimation size="50px" /></div>
    <img
      src={BASE_URL + `/api/images/${src}`}
      onLoad={() => setLoading(false)} style={{
      height: "100%", width: "100%", objectFit: "cover", display: loading || !src ? "none" : "" }}>
    </img>
  </div>
}
