import { useState } from "react";
import { signup } from "../services/api";
import "../stylesheet/auth.css";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loader, setLoader] = useState(false);
  let navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    setLoader(true);
    e.preventDefault();
    if (password !== confirmPassword) {
      setLoader(false);
      alert("password mismatch")
    }
    else {
      const res = await signup(email, password);
      setLoader(false);
      console.log(res);
      if (res.success) {

        navigate("/app/card");
      }
      else {
        alert("something went wrong");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Signin</h2>

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

          <input
            className="auth-input"
            type="password"
            placeholder="confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button className="auth-button" type="submit">
            Signup
          </button>
        </form>

        <p className="auth-link">
          Don't have account? <Link to="/signup">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;