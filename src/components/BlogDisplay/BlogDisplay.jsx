import "./BlogDisplay.css"
import "../../common.css"
import { useState } from "react";
import React from "react";
import { Remarkable } from "remarkable"
import { LoadingAnimation } from "../LoadingAnimation/LoadingAnimation.jsx"
import SmallerArticleDispaly from "../SmallerArticleDisplay/SmallerArticleDisplay.jsx"

const md = new Remarkable();
const ARTICLE_TEST = {
  title: "Dog eats crab!",
  author: "Joe Joseph",
  authorImg: "this'll be fetched in testing",
  content: "this'll be fetched in testing!!\nthis is more text\n*this is styled text*",
  contentImg: "this'll be fetched in testing",
  summary: "local dog eats a crab! Insane! $200 giveaway for the low price of $400! I really don't know what to put for example text here! But I have to keep talking otherwise it'll not be long enough! I don't know why I'm using so many !s! Either way, it just has to be long enough that we hit overflow so I can make sure it elipsizes correctly",

}

export default function BlogDisplay({ article }) {
    return <div style={{position: "relative"}}>
      <Image src={article.contentImg}/>
      <div className="contentcontainer">
        <div className="content">
          <Title title={article.title}/>
          <Author author={article.author} authorImg={article.authorImg}/>
          <Content markdown={md.render(article.content)}/>
        </div>
        <ReadMore/>
      </div>
    </div>
}

function Image({ src }) {
  var [loading, setLoading] = useState(true)
  function onload() { setLoading(false) }

  return <div className="imagecontainer">
      <div className="center-content" style={{display: loading || !src ? "" : "none"}}><LoadingAnimation/></div>
      <img src={src} onLoad={onload} style={{height: "100%", width: "100%", objectFit: "cover", display: loading || !src ? "none" : ""}}></img>
  </div>
}

function Content({ markdown }) {
  return !markdown ?
      <div className="center-content" style={{height: "100%"}}><LoadingAnimation/></div> :
      <div dangerouslySetInnerHTML={{ __html: markdown }}></div>
}

function Title({ title }) {
  return <div className="title">{title}</div>
}

function Author({ author, authorImg }) {
  return <div className="author">
      <img className="authorimg" src={authorImg}/>
      <div className={"authortext center-content"}>{author}</div>
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
    return <div className="readmore">{ this.state.articles.map(article => <SmallerArticleDispaly article={article}/>) }</div>
  }
}
