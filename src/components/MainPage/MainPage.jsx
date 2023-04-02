import "./MainPage.css"
// import { useState } from "react"
import React from "react"
import { SmallArticleDisplay } from "../SmallArticleDisplay/SmallArticleDisplay"

export class MainPage extends React.Component {
  
  constructor(props) {
    super(props)
    
    this.state = {
      articles: [...Array(4)].map(()=>({title:null,subtitle:null,contentImage:null})),
      test: null,
    }
   
    const simulateFetch = (async () => {
      
      //our response is going to be a json object
      const fetchOne = (async () => {
        let response = {
          title: "Isenberg under fire",
          subtitle: "they made another racist joke to no one's suprise, they're all buisiness students anyways",
          synopsis: "This is a longer bit of text that will display under some forms of articles because we'll have extra space maybe",
          author: "bennett gillig",
        }
        response.contentImg = (await fetch("https://dog.ceo/api/breeds/image/random").then(a=>a.json())).message
        return response
      })
      
      let promises = [...Array(4)].map(async ()=>await fetchOne())      
      let result = await Promise.all(promises)

      this.setState({articles: result})
      this.setState({test: "heyo"})

    }).bind(this)
    
    simulateFetch()
    
  }
  
  render() {
    return <div style={{display: "grid", gridTemplateColumns: "400px 400px"}}>
        { this.state.articles.map((article, i) => 
          <SmallArticleDisplay article={article} test={this.state.test} key={i}/>
        )}
      </div>
  }
}

