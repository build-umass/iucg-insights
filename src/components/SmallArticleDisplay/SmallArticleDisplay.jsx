import "./SmallArticleDisplay.css"
import "../../common.css"
import { useState } from "react"
import React from "react"
import { LoadingAnimation } from "../LoadingAnimation/LoadingAnimation"

export class SmallArticleDisplay extends React.Component {
  constructor(props) {
    super(props);
  }
// this is the component that renders the articles on the main page
  render() {
    return <div className="smallarticledisplaycontainer">
        <Image src={this.props.article.contentImg} style={{height: "240px"}}/>
        <div className="textcontainer">
          {/* <span className="tags">{this.props.article.tags ? this.props.article.tags.join(", ") : ""}</span><br/> */
          /* Since the mongoose.Schema doesn't contain tag element, so I use the subtitle as substitute */ }
          <span className="title">{this.props.article.title}</span><br/>
          <span className="subtitle">{this.props.article.subtitle}</span><br/>
          <span className="synopsis">{this.props.article.synopsis}</span><br/>
        </div>
      </div>
  }
}
// this function renders the image for the article
function Image({ src }) {
  const [loading, setLoading] = useState(true);

  function onload() {
    setLoading(false);
  }
  
  return <div className="imagecontainer">
      <div className="center-content" style={{display: loading || !src ? "" : "none"}}><LoadingAnimation size="50px"/></div>
      <img src={src} onLoad={onload} style={{height: "100%", width: "100%", objectFit: "cover", display: loading || !src ? "none" : ""}}></img>
    </div>
}
