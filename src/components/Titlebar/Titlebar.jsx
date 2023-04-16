import "./Titlebar.css"
import React from "react"
import { useNavigate } from "react-router-dom"

const Titlebar = () => {
  const navigator = useNavigate()
  return <div className="titlebar">
    <div className={"title center-content"}>IUCG</div>
    <div className={"nav center-content"}>
      <div className="button">Home</div>
      <div className="button">Dog</div>
      <div className="button">Dog 2</div>
      <div className="button" onClick={(e) => navigator("/login")}>Login</div>
    </div>
  </div>
}

export default Titlebar;
