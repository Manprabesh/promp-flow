import { useState } from "react";
import { login, OAuthLogin } from "../services/api";
import "../stylesheet/auth.css";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

import { GoogleLogin } from '@react-oauth/google';
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  let navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    setLoader(true)
    e.preventDefault();
    const res = await login(email, password);
    setLoader(false);
    console.log(res);
    if (res.sucess) {

      navigate("/app/card");
    }
    else {
      alert("something went wrong");
    }

  };

  const handleGoogleLogin = async (credential: string | undefined) => {
    try {

      const res = await OAuthLogin(credential);
      if (res.success) {
        console.log(res);
      navigate("/app/card");

      }
    } catch (error) {
      console.log('error in OAuth', error)
    }
  }
  return (
    <>

      {/* {
        loader && <Loader />
      } */}

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
            <GoogleLogin
              onSuccess={credentialResponse => {
                handleGoogleLogin(credentialResponse.credential);
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
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
    </>
  );
};

export default Login;

