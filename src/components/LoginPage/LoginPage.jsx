import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { login } from "../../api.js"

function LoginPage() {
  const [, setCookie] = useCookies(['myCookie']);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    login(password).then(
      () => { setCookie("isAdmin", password, {maxAge: 604800}); navigate("/") },
      () => console.log("bad :("));
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
