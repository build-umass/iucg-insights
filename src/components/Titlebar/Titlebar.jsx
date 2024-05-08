import "./Titlebar.css"
import React from "react"
import { useNavigate } from "react-router-dom"
import 'material-symbols';

export default function Titlebar() {

  const navigate = useNavigate()
 
  return <div className="titlebar">
    <div onClick={() => navigate("/")} className={"title center-content"}>
      <img src="logo_light.png" alt="Isenberg Undergraduate Consulting Group"></img>
    </div>
    <div className={"nav center-content"}>
      <div className="material-symbols-outlined" onClick={() => navigate("/search")} htmlFor="top-search-bar">search</div>
    </div>
  </div>
}
