import { useState } from "react";
import { login } from "../services/api";
import "../stylesheet/auth.css";
import { Link,useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await login (email, password);
    console.log(res);
    if(res.sucess){

        navigate("/app/card");
    }
    else{
        alert("something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Signup</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-button" type="submit">
            Signup
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

