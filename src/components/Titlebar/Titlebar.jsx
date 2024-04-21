import "./Titlebar.css"
import React, { useState } from "react"
import React from "react"
import { useNavigate } from "react-router-dom"
import 'material-symbols';
import SearchPage from "../SearchPage/SearchPage";

export default function Titlebar({ nosearch }) {

  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate()
 
  return <div className="titlebar">
    <div onClick={() => navigate("/")} className={"title center-content"}>
      <img src="logo_light.png" alt="Isenberg Undergraduate Consulting Group"></img>
    </div>
    <div className={"nav center-content"} style={{display: nosearch ? "none" : undefined}}>
      <div
      className="material-symbols-outlined"
      onClick={() => setIsSearching(true)}
      htmlFor="top-search-bar">search</div>
    </div>
    <SearchPage isActive={isSearching} close={() => setIsSearching(false)}></SearchPage>
  </div>
}
