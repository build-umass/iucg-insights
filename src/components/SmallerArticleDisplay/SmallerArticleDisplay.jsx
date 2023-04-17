import "./SmallerArticleDisplay.css"
import "../../common.css"
import React from "react"

export default function SmallerArticleDisplay({ article }) {
  if (!article) return <></>;
  return <div className="smallerarticledisplaycontainer">
      <div className="textcontainer">
        <span className="title">{article.title}</span><br/>
        <span className="summary">{article.summary}</span>
      </div>
    </div>
}

