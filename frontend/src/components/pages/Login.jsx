import api from "../../js/Api";
import React, { useState } from "react";
import Cookies from 'universal-cookie';
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');
  const [errText, setErrText] = useState('');
  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
    setLoginToken();
  }

  const setLoginToken = () => {
    setErrText('');
    if (username.length === 0 || pwd.length === 0) {
      setErrText('Password or Username empty');
      return;
    }

    api.post('/api-token-auth', {
      username: username,
      password: pwd
    }).then(function (res) {
      cookies.set('Token', res.data.token, { path: '/' });
      cookies.set('userId', res.data.userId, { path: '/' });
      console.log(res.data.token);
      console.log(res.data.userId);
      navigate("/newsfeed", { state: { cookiesData: { token: res.data.token, userId: res.data.userId } } });
    }).catch(err => handleLoginErrors(err));
  }

  const handleLoginErrors = (err) => {
    if (err.response == null) {
      console.log(err);
      return;
    }

    if (err.response.status === 400) {
      setErrText(err.response.data.non_field_errors);
    } else {
      console.log(err.response);
    }
  }

  return (
    <div className="auth-form-container">
      <h1>Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="username"><b>Username</b></label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="username"
          placeholder="username"
          id="username"
          name="username"
        />
        <br />
        <label htmlFor="password"><b>Password</b></label>
        <input
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          type="password"
          placeholder="********"
          id="password"
          name="password"
        />
        <h4 style={{ color: 'red', fontWeight: 'bold' }}>{errText}</h4>
        <button id="submit" type="submit">Log In</button>
      </form>
      <Link to={`/register`} className="link-btn">Don't have an account? Register here!</Link>
    </div>
  )
}
