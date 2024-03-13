import "./Titlebar.css"
import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie";
import { searchArticle } from "../../api"
import 'material-symbols';

export default function Titlebar({ setArticles }) {
  const [cookies, , removeCookie] = useCookies(['myCookie']);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const navigator = useNavigate()
  
  const handleSubmit = async (event) => {
    const articles = await searchArticle(search);
    setArticles(articles || []);
    event.preventDefault();
  };
  
  return <div className="titlebar">
    <div className={"title center-content"}>
      <img src="logo_light.png" alt="Isenberg Undergraduate Consulting Group"></img>
    </div>
    <div className={"nav center-content"}>
      <span className="material-symbols-outlined" onClick={() => {setOpen(!open)}}>search</span>
      <input
        className={`search-bar ${open ? " open" : ""}`}
        type="search"
        value={search}
        onChange={e=>{setSearch(e.target.value)}}
        placeholder="Search"
      />
    </div>
  </div>
}
