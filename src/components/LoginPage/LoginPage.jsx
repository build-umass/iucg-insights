import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:5000";

function LoginPage() {
  const [, setCookie] = useCookies(['myCookie']);
  const [password, setPassword] = useState('');
  const navigator = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await axios.post("/login", {password: password});
      setCookie("isAdmin", true, {maxAge: 604800}) // lasts for a week (7 days)
      navigator("/")
    } catch (e) {
      console.log("error logging in")
    }
    
  };
  
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={handlePasswordChange}
        />
      <button type="submit">Submit</button>
    </form>
  );
}

export default LoginPage;
