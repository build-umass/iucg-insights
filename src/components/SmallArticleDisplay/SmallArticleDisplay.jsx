import "./SmallArticleDisplay.css"
import "../../common.css"
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie";
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation"

export default function SmallArticleDisplay({ article, removeCallback }) {
  const navigate = useNavigate()
  
  const [cookies,,] = useCookies(['myCookie']);
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
    if (event.target.parentElement == dropdown) return;
    setHide(true)
  }
  window.addEventListener("click", onclick)
  useEffect(()=>()=>window.removeEventListener("click", onclick)) //cleanup
  
  const navArticle=()=>navigate(`/articles/${article._id}`)
  const navEditArticle=e=>{navigate(`/articles/${article._id}`,{state: {edit: true}}); e.stopPropagation()}
  const deleteArticle=e=>{removeCallback(); e.stopPropagation()}
  const toggleDots=e=>{setHide(!hide); e.stopPropagation()}
      
  return <div className="smallarticledisplaycontainer" onClick={()=>navigate(`/articles/${article._id}`)}>
    <Image onClick={navArticle} src={article.contentImg} style={{height: "240px"}}/>
    <div className="textcontainer" onClick={navArticle}>
      {article.tags.map((tag, index) => (
        <span key={index} className="tags">{tag+'   '}</span>
      ))}<br />
      <span className="date">{article.created.substring(0,10)}</span><br/>

      <span className="title">{article.title}</span>
    </div>
    {cookies.isAdmin && <>
    <svg className="dotdotdot" ref={dotdotdot} onClick={toggleDots} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect width="100" height="100"/> <circle cx="80" cy="50" r="10" fill="#C8CAD1"/> <circle cx="50" cy="50" r="10" fill="#C8CAD1"/> <circle cx="20" cy="50" r="10" fill="#C8CAD1"/></svg>
    <div className={"buttons hide"} ref={dropdown}>
      <div onClick={navEditArticle} style={{"--offset": 1}}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
      </div>
      <div onClick={deleteArticle} style={{"--offset": 2}}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
      </div>
      <div style={{"--offset": 3}}></div>
      <div style={{"--offset": 4}}></div>
    </div> </>}
  </div>
}
// this function renders the image for the article
function Image({ src }) {
  const [loading, setLoading] = useState(true);

  return <div className="imagecontainer">
    <div className="center-content" style={{ display: loading || !src ? "" : "none" }}><LoadingAnimation size="50px" /></div>
    <img src={src} onLoad={() => setLoading(false)} style={{ height: "100%", width: "100%", objectFit: "cover", display: loading || !src ? "none" : "" }}></img>
  </div>
}
