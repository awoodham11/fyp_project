import React, { useEffect, useState } from 'react';
import api from '../../js/Api';
import '../../css/Search.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';


export const Search = () => {
  const [searchType, setSearchType] = useState('users'); // default to searching for users
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [tempSearch, setTempSearch] = useState('')
  
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }
    if(searchType === 'users') {
      api.get(`/get-users?username=${searchTerm}`)
        .then((res) => {
          console.log(res.data);
          setSearchResults(res.data);
          setTempSearch('users')
        })
        .catch((err) => console.log(err));
    } else if(searchType === 'posts'){
        api.get(`/get-posts?title=${searchTerm}`)
        .then((res) => {
          console.log(res.data);
          setSearchResults(res.data);
          setTempSearch('posts')
        })
        .catch((err) => console.log(err));
    } 
  }, [searchTerm, searchType]);
  
  var obj;

  function displaySearchContent(searchType){
    if(tempSearch === 'users'){
      return(
        <div>
          {searchResults.length > 0 && (
          <ul>
            <div className='posts-users-container'>
              {searchResults.map((user) => (
                <div key={user.id} className='user-search-block'>
                  <div className='profile-info'>
                    <FontAwesomeIcon icon={faUserCircle} className="profile-icon"/>
                    <NavLink to={ "/user/" + user.username }>
                      <p style={{color: 'black'}} className='username' key={user.id}>{user.username}</p>                    
                    </NavLink>
                  </div>
                </div>
              ))}
            </div>
          </ul>
          )}
        </div>
      )
    }
    else if(tempSearch === 'posts'){
      return(
        <div>
          {searchResults.length > 0 && (
          <ul>
            <div className='posts-users-container'>
              
            </div>
          </ul>
        )}
        </div> 
      )
    }
    
 }

  

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className='search-container'>
      <h2>Search</h2>
      <div>
        <input id="search-term" type="text" placeholder='Search for users' value={searchTerm} onChange={handleSearchTermChange} />
      </div>
      <div>
        {displaySearchContent(searchType)}
      </div>      
    </div>
    
  );
}
