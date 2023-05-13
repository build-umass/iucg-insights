import "./Titlebar.css"
import React from "react"
import { useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie";

const Titlebar = () => {
  const [cookies, , removeCookie] = useCookies(['myCookie']);
  const navigator = useNavigate()

  const renderAdmin = () => {
    if (cookies.isAdmin) {
      return <> 
        <div className="button" onClick={() => navigator("/create")}>Create</div>
        <div className="button" onClick={() => {removeCookie("isAdmin"); navigator(0)}}>Logout</div>
      </>
    } else {
      return <> 
        <div className="button" onClick={() => navigator("/login")}>Login</div>
      </>
    }
  }

  return <div className="titlebar">
    <div className={"title center-content"}>IUCG</div>
    <div className={"nav center-content"}>
      <div className="button">Home</div>
      <div className="button">Dog</div>
      {renderAdmin()}
    </div>
  </div>
}

export default Titlebar;
