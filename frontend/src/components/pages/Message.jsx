import React, { useEffect, useState } from "react";
import api from "../../js/Api"
import axios from 'axios';
import "../../css/Message.css"
import Cookies from "universal-cookie";
import moment from 'moment';
import { Link, useNavigate } from "react-router-dom";


export const Message = () => {
    const [messages, setMessages] = useState([]); 
    let [newSearch, setnewSearch] = useState({search: ""});

    const cookies = new Cookies();
    const userId = cookies.get('userId');
    console.log(userId)
    const navigate = useNavigate();
    
    useEffect(() => {
        try {
            api.get(`/my-messages/${userId}`)
                .then((res) => {
                    if (Array.isArray(res.data)) {
                        // Group messages by conversation
                        const groupedMessages = {};
                        res.data.forEach((msg) => {
                            
                            const otherUserId = msg.sender.id === userId ? msg.receiver.id : msg.sender.id;
                            
                            
                            if (!groupedMessages[otherUserId] || moment(groupedMessages[otherUserId].timestamp).isBefore(moment(msg.timestamp))) {
                                groupedMessages[otherUserId] = msg;
                            }
                        });
                        
                        setMessages(Object.values(groupedMessages));
                    } else {
                        console.error("Unexpected response format:", res.data);
                    }
                })
                .catch((err) => {
                    if (axios.isCancel(err)) {
                        console.log("Request cancelled");
                    } else {
                        console.error("Error fetching messages: ", err);
                    }
                });
        } catch (error) {
            console.error("Error decoding the token: ", error);
        }
    }, [userId]);
    
    
    const handleSearchChange = (event) => {
        setnewSearch({
            ...newSearch,
            [event.target.name]: event.target.value,
        });

    };

    const SearchUser = () => {
        api.get('/search-chat/' + newSearch.username )
        .then((res) => {
            if (res.status === 404) {
                console.log(res.data.detail);
                alert("User does not exist");
            } else {
                navigate('/search-chat/' + newSearch.username);
            }
        })
        .catch((error) => {
            alert("User Does Not Exist")
        });
    };


    

    return (
        <div className="chat-container">
            <h2>Messages</h2>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search..."
                onChange={handleSearchChange}
                name='username'
              />
              {/* Search for a user */}
              <button onClick={SearchUser}><i></i></button>
            </div>
            <ul className="message-list">
                {messages.map((msg) => (
                    <li key={msg.id} className="display-chats">
                        <Link to={'/inbox/' + (msg.sender.id === userId ? msg.receiver.id : msg.sender.id) + '/'}>
                            <div>
                                {moment.utc(msg.timestamp).local().startOf('seconds').fromNow()}
                                <div>
                                    {/* Get sender username */}
                                    @{msg.sender.id === userId ? msg.receiver.username : msg.sender.username}
                                </div>
                            </div>
                        </Link>
                        <br/>
                    </li>
                ))} 
            </ul>
        </div>
      )
      



}

