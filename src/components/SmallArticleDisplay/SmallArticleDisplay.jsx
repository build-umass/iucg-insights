import "./SmallArticleDisplay.css"
import "../../common.css"
import { useState } from "react"
import React from "react"
import { LoadingAnimation } from "../LoadingAnimation/LoadingAnimation"

export class SmallArticleDisplay extends React.Component {
  
  constructor(props) {
    super(props)
  }
  
  render() {
    return <div className="smallarticledisplaycontainer">
        <Image src={this.props.article.contentImg} style={{height: "240px"}}/>
        <div className="textcontainer">
          <span className="tags">{this.props.article.tags ? this.props.article.tags.join(", ") : ""}</span><br/>
          <span className="title">{this.props.article.title}</span><br/>
        </div>
      </div>
  }
}

function Image({ src }) {
  var [loading, setLoading] = useState(true)
  function onload() { setLoading(false) }

  return <div className="imagecontainer">
      <div className="center-content" style={{display: loading || !src ? "" : "none"}}><LoadingAnimation size="50px"/></div>
      <img src={src} onLoad={onload} style={{height: "100%", width: "100%", objectFit: "cover", display: loading || !src ? "none" : ""}}></img>
    </div>
}
