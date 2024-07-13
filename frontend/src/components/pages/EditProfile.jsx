import React, { useEffect, useState } from "react";
import '../../css/EditProfile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome' 
import {faGear} from '@fortawesome/free-solid-svg-icons'; 
import api from "../../js/Api"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const EditProfile = ({props}) => {

    const [picture, setPicture] = useState('media/profile_pictures/default.jpg')
    const [inputs, setInputs] = useState({});
    const [isPrivate, setPrivate] = useState (false);
    const [dark, setDark] = useState(false);
    const [reloading, setReloading] = useState(false);
    const [currentPic, setCurrentPic] = useState();
    const navigate = useNavigate();
    

    const handleChange = (event) => {
      const targetName = event.target.name;
      const targetValue = event.target.value;
      setInputs(values => ({...values, [targetName]: targetValue}))
    }
  
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(inputs.bioIn)
        const config =  {headers: {'content-type': 'multipart/form-data'}}
        let form_data = new FormData();
        if (inputs.name != null) form_data.append('name', inputs.name);
        if (inputs.bio != null) form_data.append('bio', inputs.bio);
        if (inputs.email != null) form_data.append('email', inputs.email);
        if (inputs.occupation != null) form_data.append('occupation', inputs.occupation);
        api.post('/edit-profile', form_data, config)
            .then((res) => {
                toast("Your changes have been saved!");
                navigate("/profile");
            })
            .catch(err => console.log(err));
    };

    const onImageChange = (e) => {
        console.log(e.target.files[0]);
        console.log(e.target.value);
        setPicture (e.target.files[0]);
        console.log(picture);
    }

    const handleImageSubmit = (e) => {
        e.preventDefault();
        console.log(e);
        const config =  {headers: {'content-type': 'multipart/form-data'}}
        let image_data = new FormData();
        image_data.append('profile_picture', picture, picture.name);
        api.post('/edit-picture', image_data, config)
            .then(res => {
                toast("Your new profile picture has been saved!");
                navigate("/profile");            
            })
            .catch(err => console.log(err))  
        
      };

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
        api.get("/edit-picture")
        .then((res) => {
            setCurrentPic("http://localhost:3000" + res.data.profile_picture)
            console.log(res.data.profile_picture)
        })
        .catch((err) => {
            if(axios.isCancel(err)){
                console.log("cancelled")
            }else{
                console.log(err)
            }
        })
        
        
        api.get("/edit-mode")
        .then((res) => {
            setDark(res.data.dark_mode)
            setPrivate(res.data.is_private)
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
        }},[])
    

        const handlePrivateMode= (e)=> {
            setPrivate(true);
            setReloading(true);
          }
    
          const handlePublicMode = (e) => {
            setPrivate(false);
            setReloading(true);
          }
    
          const handleLightMode = (e) => {
            setDark(false);
            setReloading(true);
          }
    
          const handleDarkMode = (e) => {
            setDark(true);
            setReloading(true);
          }
    
    useEffect(() => {

    if (!reloading) return;
        
    
    const config =  {headers: {'content-type': 'multipart/form-data'}}
    api.post('/edit-mode', { dark_mode: dark, is_private: isPrivate }, config)
        .then(res => {
            console.log(res.data);
            console.log("Your changes have been saved");
            toast("Your changes have been saved!");

            setTimeout(() => window.location.reload(true), 1000);
                
        })
        .catch(err => {
            console.log(err);
            toast("Sorry, your changes could not be saved!");
        }) 
    }, [reloading, isPrivate, dark]);

    return (
        <div className="profileContainer">
            <h1>Edit your profile</h1>

            <div className="profilePicture">
                <label htmlFor="image">Change Profile Picture</label>
                <img src = {currentPic} alt="profile picture"/>
                <form onSubmit={handleImageSubmit}>
                    <input type="file" 
                           accept="image/png, image/jpeg" 
                           onChange={onImageChange} 
                           id="image" 
                           name="image"
                           alt = "Choose Image"
                           aria-label="Choose Image"
                    />
                    <br/>
                    <input type="submit" value="Upload image"></input> 
                </form>
            </div> 

            <div className="names">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name"> Name
                        <br/>
                        <input type="text" value={inputs.name || " "} onChange={handleChange} name="name" />
                    </label>
                    <br/>
                    <label htmlFor="name"> Email
                        <br/>
                        <input type="email" value={inputs.email || " "} onChange={handleChange} name="email" />
                    </label> 
                    <br/>
                    <label htmlFor="name"> Bio
                        <br/>
                        <input type="text" value={inputs.bio || " "} onChange={handleChange} name="bio"/>
                    </label> 
                    <br/>
                    <label htmlFor="name"> Occupation
                        <br/>
                        <input type="text" value={inputs.occupation || " "} onChange={handleChange} name="occupation"/>
                    </label>   
                    <br/>               
                    {/* other fields */}
                    <input type="submit" value="Update details" />
                </form>
            </div>


            <div className="settings">
                <h2> Settings
                    <FontAwesomeIcon icon = {faGear} className= "cog"/>
                </h2>
                <div className = "publicPrivateMode">
                    <h3>Your account is currently { isPrivate ? "private" : "public" } </h3>
                    <button onClick={handlePrivateMode}>
                        Private
                    </button>
                    <button onClick={handlePublicMode}>
                        Public
                    </button>
                </div>

                <div className="themeSetting">
                    <h3>The current theme is { dark ? "dark" : "light" } </h3>
                    <button onClick={handleLightMode}>
                        Light Mode
                    </button>
                    <button onClick={handleDarkMode} >
                        Dark Mode
                    </button>
                </div>
            </div>
        </div>

    );
}
