import React, { useState } from "react";
import api from "../../js/Api";
import Cookies from 'universal-cookie';
import { Link, useNavigate } from "react-router-dom";


export const Register = () => {
    const [name, setName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username,setUsername] = useState('');
    const [pwd, setPwd] = useState('');
    const [submitResult,setSubmitResult] = useState('');
    const [pwd2, setPwd2] = useState('');
    const [usernameMissing,setUsernameMissing] = useState('');
    const [pwdMissing,setPwdMissing] = useState('');
    const [pwd2Missing,setPwd2Missing] = useState('');
    const [emailMissing,setEmailMissing] = useState('');
    const navigate = useNavigate();

    const cookies = new Cookies();

    const token = 'asdflkj2ewmnsasdfmnwelfkjsdfghdfghdv.wlsfdkwefojdfgh'

    const errorStyle = {
        color: 'red',
        fontWeight: 'bold',
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    function registerUser(){
        resetMissing();
        api.post(`/register`,{
            username: username,
            password: pwd,
            password2: pwd2,
            email: email,
            first_name: name,
            last_name: lastname,
            headers : {"Authorization" : `JWT ${token}`}
        },
        
        ).then(navigate('/login'))
        .catch((err) => {
            if(err.response){
                if(err.response.status === 400){
                    handleMissingElements(err.response.data);
                }
                else{
                    setSubmitResult(err.response.data.detail);
                }
            }
            else if(err.request){
                console.log(err.request.username)
            }
        })
    }

    function setLoginToken(){
        setTimeout(() => {
            api.post('/api-token-auth',{
                username: username,
                password: pwd
            }).then(res => {
                cookies.set('Token',res.data.token);
                 navigate("/newsfeed");
             })
            .catch(err => console.log(err))
        }, 1000);
        
    }


    function resetMissing(){
        setEmailMissing('');
        setUsernameMissing('');
        setPwdMissing('');
        setPwd2Missing('');
    }

    function handleMissingElements(data){
        if(data.email)
            setEmailMissing(data.email);
        if(data.username)
            setUsernameMissing(data.username);
        if(data.password)
            setPwdMissing(data.password);
        if(data.password2)
            setPwd2Missing(data.password2);
    }

    return(
        <div className="log-reg-container">
            <h1>Register</h1>
            <form className="reg-form" onSubmit={handleSubmit}>
                <label htmlFor="name">First Name</label>
                <input
                    value={name}
                    name="name"
                    id="name"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="First name"
                />
                <label htmlFor="name">Last Name</label>
                <input
                    value={lastname}
                    name="lastname"
                    id="lastname"
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                />
                <label htmlFor="email">Email</label>
                <label style = {errorStyle} htmlFor="email">{emailMissing}</label>
                <input
                    value={email}
                    name="email"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="example@gmail.com"
                />
                <label htmlFor="username">Username</label>
                <label style = {errorStyle} htmlFor="username">{usernameMissing}</label>
                <input
                    value={username}
                    name="username"
                    id="username"
                    onChange={(e) => setUsername(e.target.value)}
                    type="username"
                    placeholder="username"
                />
                <label htmlFor="password">Password</label>
                <label style = {errorStyle} htmlFor="password">{pwdMissing}</label>
                <input
                    value={pwd}
                    name="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    type="password"
                    placeholder="********"
                />
                <label htmlFor="passwordConf">Confirm Password</label>
                <label style = {errorStyle} htmlFor="passwordConf">{pwd2Missing}</label>
                <input
                    value={pwd2}
                    name="password confirmation"
                    id="passwordConf"
                    onChange={(e) => setPwd2(e.target.value)}
                    type="password"
                    placeholder="********"
                />
                <button type="submit" onClick={registerUser}>Register Account</button>
                <h3>{submitResult}</h3>
            </form>
            <Link to={`/login`} className="link-btn">Already have an account? Login here!</Link>
        </div>
    )
}
