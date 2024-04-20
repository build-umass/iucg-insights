import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { login } from "../../api.js"
import "./LoginPage.css"

function LoginForm() {
  const [, setCookie] = useCookies(["myCookie"]);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
  };
  
  return <form id="loginform" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"/>
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}/>
      <button type="submit">Submit</button>
    </form>
}

function LoginPage() { 
  return <div id="background">
    <div>
      <div id="loginpagecentered">
        <img id="logo" src="/logo_light.png"></img>
        <LoginForm/>
      </div>
      </div>
  </div>
}

export default LoginPage;
