import "./SmallArticleDisplay.css"
import "../../common.css"
import { useState } from "react"
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation"

export default function SmallArticleDisplay({ article }) {
  return <div className="smallarticledisplaycontainer">
    <Image src={article.contentImg} style={{height: "240px"}}/>
    <div className="textcontainer">
      <span className="tags">{article.subtitle}</span><br/>
      <span className="title">{article.title}</span>
    </div>
  </div>
}
// this function renders the image for the article
function Image({ src }) {
  const [loading, setLoading] = useState(true);

  return <div className="imagecontainer">
      <div className="center-content" style={{display: loading || !src ? "" : "none"}}><LoadingAnimation size="50px"/></div>
      <img src={src} onLoad={() => setLoading(false)} style={{height: "100%", width: "100%", objectFit: "cover", display: loading || !src ? "none" : ""}}></img>
    </div>
}
