import React, { useState, useEffect } from "react";
import api from "../../js/Api";
import '../../css/UserProfile.css';
import axios from "axios";

export const UserProfile = (props) => {
    const [name, setName] = useState('User');
    const [bio, setBio] = useState('Looking to connect with other grads');
    const [occupation, setOccupation] = useState('');
    const [picture, setPicture] = useState()


    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
            api.get("/edit-profile")
            .then((res) => {
                if (res.data.name) {
                    setName(res.data.name);
                    setBio(res.data.bio)
                    setOccupation(res.data.occupation)
                    console.log(res.data)
                } else {
                    setName("User")
                }
            })
            .catch((err) => {
                if(axios.isCancel(err)){
                    console.log("cancelled")
                }else{
                    console.log(err)
                }
            })


            api.get("/edit-picture")
            .then((res) => {
                setPicture("http://localhost:3000/" + res.data.profile_picture)
                console.log(res.data.profile_picture)
            })
            .catch((err) => {
                if(axios.isCancel(err)){
                    console.log("cancelled")
                }else{
                    console.log(err)
                }
            })

        return () => {
            cancelToken.cancel();
        }
    },[])


    return (
        <div className='profileContainer'>
            <div className='user-profile-header'>
                <h1>{name}</h1>
                <div>
                    <img src={ picture } alt= "profile picture" className="profile-picture"/>
                </div>
            </div>
            <div className='user-profile-details'>
                <div className='user-profile-studies'>
                    <label>Occupation</label>
                    <p>{occupation}</p>
                </div>
                <div className='user-profile-about-me'>
                    <label>About Me</label>
                    <p>{bio}</p>
                </div>
                <div className="edit-profile-button-section">
                    <a href="/edit-profile">
                        <button className="profile-btn">Edit Profile</button>
                    </a>
                </div>
            </div>
        </div>
    )
}
