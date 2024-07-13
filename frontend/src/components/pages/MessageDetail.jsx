import React, { useEffect, useState } from "react";
import api from "../../js/Api"
import axios from 'axios';
import "../../css/Message.css"
import Cookies from "universal-cookie";
import { Link, useParams, useNavigate } from "react-router-dom";
import moment from 'moment';
import { toast } from "react-toastify";

export const MessageDetail = () => {
    const [message, setMessage] = useState([]);
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState([])
    const [profile, setProfile] = useState([])
    let [newMessage, setNewMessage] = useState({message: ""}); 
    let [newSearch, setNewSearch] = useState({search: ""}); 
    

    const id = useParams()
    console.log(id)
    const cookies = new Cookies();
    const userId = cookies.get('userId');
    console.log(userId)
    const navigate = useNavigate()

    // useEffect (() => {
    //     try{
    //         api.get('/my-messages/' + userId + '/')
    //         .then((res) => {
    //             setMessages(res.data)
    //             console.log(res.data)
    //         })
    //         .catch((err) => {
    //             if (axios.isCancel(err)) {
    //                 console.log("Request cancelled");
    //             } else {
    //                 console.error("Error fetching messages: ", err);
    //             }
    //         });
    //     } catch(err){
    //         console.log(err)
    //     }
    // }, [])


    useEffect (() => {
        //let interval = setInterval(() => {
            try {
                api.get('/get-messages/' + userId + '/' + id.id + '/')
                .then((res) => {
                    setMessages(res.data);
                    console.log(res.data)
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
        // }, 10000)
        // return () => {
        //     clearInterval(interval)
        // }
    }, [userId, id.id])
    //to avoid memory leakage
    //], [userId, id.id]

    useEffect(() => {
        const fetchProfile = () => {
              try {
                api.get('/profile/' + id.id)
                .then((res) => {
                  setProfile(res.data)
                  console.log(res.data)
                  setUser(res.data.user)
                  console.log(user)
                })
                  
              }catch (error) {
                  console.log(error);
                }}
            fetchProfile()
      }, [])

    const handleChange = (event) => {
        setNewMessage({
            ...newMessage,
            [event.target.name]: event.target.value
        })
    }
    console.log(newMessage);

    const SendMessage = () => {
        const formdata = new FormData()
        formdata.append("user", userId)
        formdata.append("sender", userId)
        formdata.append("receiver", id.id)
        formdata.append("message", newMessage.message)
        formdata.append("is_read", false)

        try {
            api.post('/send-messages/', formdata)
            .then((res) => {
                console.log(res.data)
                document.getElementById("text-input").value = ""
                setNewMessage(newMessage = "")
                toast("Message Sent!");
                //Show sent message in real-time as part of conversation
                fetchMessages()
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    console.log("Request cancelled");
                } else {
                    console.error("Error fetching messages: ", err);
                }
            });
        } catch (error) {
            console.log(error)
        }
    }


    const fetchMessages = () => {
        try {
            api.get('/get-messages/' + userId + '/' + id.id + '/')
            .then((res) => {
                setMessages(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err)
            })
        } catch (error) {
            console.error("Error decoding the token: ", error);
        }
    }

    const handleSearchChange = (event) => {
        setNewSearch({
            ...newSearch,
            [event.target.name]: event.target.value 
        })
    }

    console.log(newSearch.username)

    const SearchUser = () => {
        api.get('/search-chat/' + newSearch.username)
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
    }

    return (
        <div className="chat-container">
            <ul className="message-list">
                {messages.map((msg, index) => (
                    <li key={index} className={`message-item ${msg.sender.id === userId ? 'user' : 'other'}`}>
                        <div className="message-details">
                            {msg.sender.id === userId && 
                                (msg.receiver.username !== null ? msg.sender.username : msg.reciever.username)
                            }

                            {msg.sender.id !== userId && 
                                (msg.sender.username) 
                            }
                            <div>{msg.message}</div>
                            <span className="message-time">{moment.utc(msg.timestamp).local().startOf('seconds').fromNow()}</span>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="input-area">
                <input
                    type="text"
                    placeholder="Type your message"
                    name="message"
                    value={newMessage.message}
                    onChange={handleChange}
                    id="text-input"
                />
                {/* Send your message */}
                <button onClick={SendMessage}>Send</button>
            </div>
        </div>
    )
    

}