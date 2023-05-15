import "./Titlebar.css"
import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie";
import { searchArticle } from "../../api"

export default function Titlebar({ setArticles }) {
  const [cookies, , removeCookie] = useCookies(['myCookie']);
  const [search, setSearch] = useState("");
  const navigator = useNavigate()
  
  const handleSubmit = async (event) => {
    const articles = await searchArticle(search);
    setArticles(articles || []);
    event.preventDefault();
  };
  
  return <div className="titlebar">
    <div className={"title center-content"}>IUCG</div>
    <div className={"nav center-content"}>
      <input
        type="search"
        value={search}
        onChange={e=>{setSearch(e.target.value)}}
        placeholder="Search"></input>
      <div onClick={handleSubmit}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" fill="#FFFFFF"/></svg>
      </div>
      {cookies.isAdmin && <div onClick={() => navigator("/create")}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" fill="#FFFFFF"/></svg>
      </div>}
      {!cookies.isAdmin ?
      <div onClick={() => navigator("/login")}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" fill="#FFFFFF"/></svg>
      </div> :
      <div onClick={() => {removeCookie("isAdmin"); navigator(0)}}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" fill="#FFFFFF"/></svg>
      </div>}
    </div>
  </div>
}
