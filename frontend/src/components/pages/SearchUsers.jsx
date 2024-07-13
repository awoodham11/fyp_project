import React from 'react'
import '../../css/Message.css'
import api from '../../js/Api';
import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import moment from 'moment';

export const SearchUsers = () => {

  const [users, setUser] = useState([])
  const [profiles, setProfile] = useState([])
  let [newSearch, setnewSearch] = useState({search: "",});
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState([]);

  const username = useParams()
  console.log(username)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/search-chat/' + username.username)
    .then((res) => {
      setUser(res.data)
      console.log(res.data)
    })
    .catch((error) => {
      console.log(error)
    });
  }, [])
  console.log(users);
  

  const handleSearchChange = (event) => {
    setnewSearch({
      ...newSearch,
      [event.target.name]: event.target.value,
    });

  };

  console.log(newSearch.username);


  const SearchUser = () => {
    try{
        api.get('/search-chat/' + newSearch.username)
        .then((res) => {
          navigate('/search-chat/'+ newSearch.username);
          setUser(res.data)
          console.log(res.data)
        })
        .catch((error) => {
          console.log(error)
        });
    }
    catch(err){
      console.log(err)
    }
  };


  console.log(users);
  console.log(profiles);
  return (
    <div>
      <div>
      <main className="content" style={{ marginTop: "150px" }}>
        <div className="container p-0">
          <h1 className="h3 mb-3">Messages</h1>
          <div className="card">
            <div className="row g-0">
              <div className="col-12 col-lg-5 col-xl-3 border-right">
              <div className="px-4 ">
                  <div className="d-flfex align-itemfs-center">
                    <div className="flex-grow-1 d-flex align-items-center mt-2">
                      <input
                        type="text"
                        className="form-control my-3"
                        placeholder="Search..."
                        onChange={handleSearchChange}
                        name='username'

                      />
                      <button className='ml-2' onClick={SearchUser} style={{border:"none", borderRadius:"50%"}}>
                        <i className='fas fa-search'></i></button>
                    </div>
                  </div>
                </div>
                
                {users.map((usr, index) => (
                  <div key={index}>
                    <Link 
                      to={"/inbox/" + usr.user.id + '/'}
                      className="list-group-item list-group-item-action border-0"
                    >
                      <small><div className="badge bg-success float-right text-white"></div></small>
                      <div className="d-flex align-items-start">                    
                        <div className="flex-grow-1 ml-3">
                          @{usr.user.username}
                          <br/>
                          {usr.name}
                          
                          <div className="small">
                            <i className='fas fa-envelope'> Send Message</i>
                          </div>
                        </div>
                        <br/>
                      </div>
                    </Link>
                   </div> 
                ))}
                
                <hr className="d-block d-lg-none mt-1 mb-0" />
              </div>
              
            </div>
          </div>
        </div>
      </main>
    </div>
    </div>
  )
}