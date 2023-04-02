import "./MainPage.css"
import React from "react"
import { SmallArticleDisplay } from "../SmallArticleDisplay/SmallArticleDisplay"
import { Titlebar } from "../Titlebar/Titlebar"

export class MainPage extends React.Component {
  
  constructor(props) {
    super(props)
    
    this.state = {
      articles: [...Array(8)].map(()=>({title:null,subtitle:null,contentImage:null,author:null,tags:null})),
    }
   
    const simulateFetch = (async () => {
      
      //our response is going to be a json object
      const fetchOne = (async () => {
        let response = {
          title: "This is a longer title because they'll probably be longer in production",
          subtitle: "they made another racist joke to no one's suprise, they're all buisiness students anyways",
          synopsis: "This is a longer bit of text that will display under some forms of articles because we'll have extra space maybe",
          author: "bennett gillig",
          tags: ["dog", "dog2", "something", "dog3"]
        }
        response.contentImg = (await fetch("https://dog.ceo/api/breeds/image/random").then(a=>a.json())).message
        return response
      })
      
      let promises = [...Array(8)].map(async ()=>await fetchOne())      
      let result = await Promise.all(promises)

      this.setState({articles: result})

    }).bind(this)
    
    simulateFetch()
    
  }
  
  render() {
    return <div className="mainpage">
        <Titlebar/>
        <div className="articles">
        { this.state.articles.map((article, i) => 
          <SmallArticleDisplay article={article} key={i}/>
        )}
        </div>
      </div>
  }
}

