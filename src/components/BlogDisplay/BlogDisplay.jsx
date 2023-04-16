import "./BlogDisplay.css"
import { useState } from "react";
import React from "react";
import { Remarkable } from "remarkable"
import { LoadingAnimation } from "../LoadingAnimation/LoadingAnimation.jsx"

const md = new Remarkable();
const ARTICLE_TEST = {
  title: "Dog eats crab!",
  author: "Joe Joseph",
  authorImg: "this'll be fetched in testing",
  content: "this'll be fetched in testing",
  contentImg: "this'll be fetched in testing",
  summary: "local dog eats a crab! Insane! $200 giveaway for the low price of $400! I really don't know what to put for example text here! But I have to keep talking otherwise it'll not be long enough! I don't know why I'm using so many !s! Either way, it just has to be long enough that we hit overflow so I can make sure it elipsizes correctly",

}

export function BlogDisplay({ article }) {
    return <div style={{position: "relative"}}>
      <Image src={article.contentImg}/>
      <div id="contentcontainer">
        <Content markdown={md.render(article.content)}/>
        <ReadMore/>
      </div>
    </div>
}

function Image({ src }) {
  var [loading, setLoading] = useState(true)
  function onload() { setLoading(false) }

  return <div id="imagecontainer">
      <div className="center-content" style={{display: loading || !src ? "" : "none"}}><LoadingAnimation/></div>
      <img src={src} onLoad={onload} style={{height: "100%", width: "100%", objectFit: "cover", display: loading || !src ? "none" : ""}}></img>
  </div>
}

function Content({ markdown }) {
  return <div id="content">
    { !markdown ?
      <div className="center-content" style={{height: "100%"}}><LoadingAnimation/></div> :
      <div dangerouslySetInnerHTML={{ __html: markdown }}></div>
    }
  </div>
}


class ReadMore extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      articles: Array(5).fill(null)
    }

    const simulateFetch = (async () => {
      //wait some time
      await new Promise(r=>setTimeout(r,0));

      this.setState({articles: Array(5).fill(ARTICLE_TEST)})
    }).bind(this)
    simulateFetch()
  }

  render() {
    return <div id="readmore">{ this.state.articles.map(article => <ReadMoreCard article={article}/>) }</div>
  }
}


function ReadMoreCard({ article }) {
  return <div className="readmorecard">
    { !article ?
      <div className="center-content"><LoadingAnimation/></div> :
      <>
        <div>{article.title}</div>
        <div className="summary">{article.summary}</div>
      </>
    }
  </div>
}
