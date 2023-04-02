import "./Titlebar.css"
import React from "react"

export class Titlebar extends React.Component {
  
  render() {
    return <div className="titlebar">
      <div className={"title center-content"}>IUCG</div>
      <div className={"nav center-content"}>
        <div className="button">Home</div>
        <div className="button">Dog</div>
        <div className="button">Dog 2</div>
        <div className="button">Dog 3</div>
      </div>
    </div>
  }
}

