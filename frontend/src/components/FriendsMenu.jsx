import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../css/FriendsMenu.css';
import api from '../js/Api.js';


const FriendsMenu = (props) => {
    const [requests,setRequests] = useState([]);
    const [sendInput,setSendInput] = useState('');
    const [friendRes,setFriendRes] = useState(' ');
    //On menu open
    useEffect(() => {
        getRequests();
    },[])

    function getRequests(){
        api.get("/pending-request/")
        .then((res) => {
            console.log(res.data)
            setRequests(res.data)
        })
        .catch((err) => console.log(err))
    }

    useEffect(() => {
        if(requests){
            //console.log("Number of requests " + requests.length)
        }
    },[requests,])

    function sendFriendRequest(){
        api.post('/send-friend-request',{
            to_user: sendInput,
        })
        .then((res) => {
            console.log(res.data.status);
            setFriendRes(res.data.status);
        })
        .catch((err) => {
            console.log(err);
            setFriendRes(err.response.data.error);
        })
    }
    
    function respondRequest(id,response){
        api.post('/accept-friend-request',{
            id: id,
            status: response,
        })
        .then((res) => {
            console.log(res.data)
            getRequests();
        })
        .catch((err) => {
            console.log(err);
        });
    }

    function rejectRequest(id){
        console.log(id)
    }


    return (
        <div className="FriendsMenu">
            <div>
                <label for="sndReq">Send Request</label>
                <input id="sndReq" placeholder='username' name="sendReq" type="text" onChange={e => setSendInput(e.target.value)}/>
                <div>
                    <button type="button" onClick={sendFriendRequest}>Send</button>
                </div>
                <b1>{friendRes}</b1>

            </div>
            <ul className='accrej'>
                {requests.map((item) => {
                    return (
                        <div>
                            <li key={item.id} className='username'>{item.from_user.username}
                                <button onClick={e => respondRequest(item.id, "accepted")}>accept</button>
                                <button onClick={e => respondRequest(item.id, "declined")}>reject</button>
                            </li>
                        </div>
                    )
                })}
            </ul>
        </div>
    );
};

export default FriendsMenu;




