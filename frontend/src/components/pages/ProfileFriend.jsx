import React, { useState, useEffect, useMemo } from "react";
import api from "../../js/Api";
import { useNavigate, useParams, Link } from "react-router-dom";
import '../../css/UserProfile.css';
import axios from "axios";
import { toast } from "react-toastify";


export const ProfileFriend = (props) => {
    const [currUser, setCurrUser] = useState('');
    const [name, setName] = useState('User');
    const [id, setId] = useState('')
    const [username, setUsername] = useState('');
    const [occupation, setOccupation] = useState('')
    const [bio, setBio] = useState('Looking to connect');
    const [picture, setPicture] = useState('/media/profile_pictures/default.jpg')
    const [isPrivate, setIsPrivate] = useState(false)
    const [requests, setRequests] = useState([]);
    const [friendRes, setFriendRes] = useState('');
    const [requestStatus, setRequestStatus] = useState('Add Friend');

    

    const navigate = useNavigate();

    useMemo(() => {
        const url = window.location.href;
        function getCurrentUser(url) {
            var currentUser = url.split('/');
            currentUser = currentUser.at(-1);
            console.log("current user: " +currentUser);
            return currentUser;
        }
        setCurrUser(getCurrentUser(url));
        console.log("Actual current user: " + currUser);
    },[])

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
            api.get(`/get-profile-details/${currUser}`)
            .then((res) => {
                if (res.data.name) {
                    setName(res.data.name);
                } else {
                    setName("User");
                }
                setBio(res.data.bio);
                setOccupation(res.data.occupation);
                setPicture(res.data.profile_picture)
                
                setIsPrivate(res.data.is_private)
                setUsername(res.data.username)
                console.log(username)
                setId(res.data.user.id)
                console.log(res.data.user.id)
            })
            .catch((err) => {
                if(axios.isCancel(err)){
                    console.log("cancelled")
                }else{
                    console.log(err)
                }
            })
            console.log("loaded user details")


        return () => {
            cancelToken.cancel();
        }
    },[])

    
    function sendFriendRequest() {
        api.post('/send-friend-request', {
            to_user: currUser,
        })
        .then((res) => {
            console.log("friend req status:" + res.data.status);
            console.log(currUser)
            setFriendRes(res.data.status);
            toast("Friend Request Sent!");
            setRequestStatus("Pending");
        })
        .catch((err) => {
            if(err.response.data.error === "You have already sent a friend request to this user.") {
                setRequestStatus("Pending");
            }
            console.log(err);
            setFriendRes(err.response.data.error);
        })
    }


    function getRequests() {
        api.get("/pending-request")
        .then((res) => {
            setRequests(res.data.status)
            setRequestStatus("Pending");
        })
    }

    return (
        <div className='profileContainer'>
            <div className='user-profile-header'>
                <h1>{name}</h1>
                <div>
                    <img src={ picture } alt= "profile picture" className="profile-picture"/>
                </div>
            </div>
            <br/>
            <div>
                <Link to={'/inbox/' + id + '/'} className='user-profile-chat-button'>Chat with {name}</Link> 
            </div>
            <br/>
            <div>
                <button className="profile-btn" onClick={sendFriendRequest}>{requestStatus}</button>
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
            </div>
        </div>
    )
}