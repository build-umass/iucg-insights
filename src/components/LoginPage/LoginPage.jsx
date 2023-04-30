import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:5000";

function LoginPage() {
  const [password, setPassword] = useState('');
  const navigator = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await axios.post("/login", {password: password});
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
