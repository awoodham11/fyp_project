import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie'
import '../../css/Sidebar.css';


export default props => {

    const navigate = useNavigate()
    const cookies = new Cookies();

    function DeleteLoginToken(){
        cookies.remove('Token')
        navigate('/login')
    }


    return (
        <Menu>
            <NavLink to={`/newsfeed`} className='menu-item'>Newsfeed</NavLink>
            <NavLink to={`/edit-profile`} className='menu-item'>Edit Profile</NavLink>
            <NavLink to={`/profile`} className='menu-item'>My Profile</NavLink>
            <NavLink to={`/search`} className='menu-item'>Search</NavLink>
            <NavLink to={`/friends`} className='menu-item'>Friends</NavLink>
            <NavLink to={`/inbox`} className='menu-item'>Inbox</NavLink>
            <NavLink to={`/map`} className='menu-item'>Map</NavLink>
            <NavLink to={`/job-board`} className='menu-item'>Job Board</NavLink>
            <NavLink to={`/status-post`} className='menu-item'>My Status</NavLink>
            <NavLink to={`/login`} className='menu-item' 
                onClick={DeleteLoginToken}>Logout</NavLink>
            
        </Menu>
    )
}
