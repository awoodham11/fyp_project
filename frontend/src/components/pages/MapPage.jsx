import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import api from '../../js/Api';
import { Link } from 'react-router-dom'
import "../../css/MapPage.css"
import Cookies from 'universal-cookie';
import RatingStars from './RatingStars'; // Import RatingStars component

const MapPage = () => {
  const [placesData, setPlacesData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('restaurants');
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(1); 
  const [userId, setUserId] = useState(null);
  const [placeId, setPlace] = useState(null);
  const [cookiesData, setCookiesData] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');

  const mapContainerStyle = {
    width: '100%',
    height: '100vh',
  };

  const center = {
    lat: 51.509865,
    lng: -0.118092,
  };

  const libraries = ['places'];

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyA398smOp0rx5hhahTvaM3S0S6fNZQnR6Y',
    libraries,
  });

  useEffect(() => {
    const fetchPlacesData = () => {
      try {
        setLoading(true);
        api.get(`/search-on-map/?filter=${selectedFilter}`)
        .then((res) => {
          setPlacesData(res.data.places);
        })
        .catch((err) => {
          console.log(err)
        })
        
      } catch (error) {
        console.error('Error fetching places data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlacesData();
  }, [selectedFilter]);

  useEffect(() => {
    // Fetch cookies data when component mounts
    const cookies = new Cookies();
    const userId = cookies.get('userId');
    setUserId(userId);
  }, []);

  const handleMarkerClick = (placeId) => {
    try {
      api.post(`/get-place-details/?place_id=${placeId}`)
      .then((res) => {
        setSelectedPlace(res.data);
        setSidebarOpen(true);
        setPlace(placeId); 
      })
      .catch((err) => {
        console.log(err)
      })
      
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handlePostComment = () => {
    try {
      api.post('/search-on-map/', {
        place_id: placeId,
        comment: comment,
        rating: rating,
        userId: userId,
      });
      // Refresh place details after posting comment and rating
      handleMarkerClick(placeId);
    } catch (error) {
      console.error('Error posting comment and rating:', error);
    }
  };

  const handleReportComment = (commentId, commentUserId) => {
    try {
      const res = api.post('/report-comment/', {
        commentId: commentId,
        userId: userId,
        commentUserId: commentUserId,
      });
      if (res.data.success) {
        setPopupMessage('Reported');
        setTimeout(() => {
          setPopupMessage('');
        }, 1000);
      } else if (res.data.deleted) {
        setPopupMessage('Reported');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setPopupMessage('Action Prohibited');
        setTimeout(() => {
          setPopupMessage('');
        }, 1000);
      }
    } catch (error) {
      console.error('Error reporting comment:', error);
    }
  };

  const renderMarkers = () => {
    return placesData.map((place, index) => {
      const { latitude, longitude, place_id } = place;
      const position = { lat: latitude, lng: longitude };

      return (
        <Marker
          key={index}
          position={position}
          onClick={() => handleMarkerClick(place_id)}
        />
      );
    });
  };

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading maps';

  return (
    <div style={{ width: '100%', display: 'flex' }}>
      {/* Filter section */}
      <div style={{ width: '20%', padding: '20px', borderRight: '2px solid black', backgroundColor: '#4CAF50', borderRadius: '10px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>Search Nearby Amenities</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ margin: '20px 0' }}>
            <button onClick={() => handleFilterClick('restaurants')} style={buttonStyle}>
              Restaurants
            </button>
          </div>
          <div style={{ margin: '20px 0' }}>
            <button onClick={() => handleFilterClick('transportation')} style={buttonStyle}>
              Transportation
            </button>
          </div>
          <div style={{ margin: '20px 0' }}>
            <button onClick={() => handleFilterClick('healthcare')} style={buttonStyle}>
              Healthcare
            </button>
          </div>
        </div>
      </div>

      {/* Map section */}
      <div style={{ width: sidebarOpen ? '80%' : '100%', position: 'relative', transition: 'width 0.5s' }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={10}
          center={center}
        >
          {renderMarkers()}
        </GoogleMap>
      </div>

      {/* Toggle sidebar button */}
      <div style={{ position: 'fixed', top: '50%', right: '0', transform: 'translateY(-50%)', padding: '5px', fontSize: '20px', cursor: 'pointer' }}>
        <button onClick={toggleSidebar} style={{ fontSize: '24px', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '50%', zIndex: '999' }}>{sidebarOpen ? '←' : '→'}</button>
      </div>

      {/* Sidebar */}
      {selectedPlace && (
        <div style={{ width: sidebarOpen ? '30%' : '0%', padding: '0px', backgroundColor: '#f2f2f2', overflowY: 'auto', maxHeight: '100vh', transition: 'width 0.5s', border: '2px solid black', borderLeft: 'none', borderTopRightRadius: '0px', borderBottomRightRadius: '10px' }}>
          {/* Place details */}
          <div style={{ color: 'black', padding: '10px', borderBottom: '2px solid black', textAlign: 'center' }}>
            <h3 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>{selectedPlace.name}</h3>
            <p style={{ fontSize: '16px', marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '5px', fontStyle: 'italic' }}>Address: {selectedPlace.address}</p>
          </div>
          {/* Reviews section */}
          <div style={{ color: 'black', padding: '10px' }}>
            <h4 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>Reviews:</h4>
            {selectedPlace.comments && selectedPlace.comments.map((comment, index) => (
              <div key={index} style={{ color: 'black', marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px', position: 'relative' }}>
                <Link style={{color: 'black'}} to={'/user/' + comment.user_name}>
                  <p style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '5px', textAlign: 'left' }}>@{comment.user_name}</p>
                </Link>
                <div style={{ color: 'black', display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <RatingStars rating={comment.rating} /> 
                </div>
                <p style={{ color: 'black', fontSize: '12px', marginBottom: '5px', textAlign: 'left' }}>{comment.text}</p>
                <button onClick={() => handleReportComment(comment.commentId, comment.commentUserId)} style={{ position: 'absolute', top: '5px', right: '5px', fontSize: '12px', color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Report</button>
              </div>
            ))}
          </div>
          {/* Add Your Review section */}
          <div style={{ color: 'black', padding: '10px' }}>
            <h4 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>Add Your Review:</h4>
            <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Your comment" style={{ marginBottom: '15px', width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' }} />
            <div style={{ marginBottom: '15px' }}>
              <span style={{ fontSize: '18px', marginRight: '10px' }}>Your Rating:</span>
              <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <button onClick={handlePostComment} style={{ backgroundColor: '#45a049', border: 'none', color: 'white', padding: '15px 32px', textAlign: 'center', textDecoration: 'none', display: 'inline-block', fontSize: '16px', cursor: 'pointer', borderRadius: '8px' }}>Post</button>
          </div>
        </div>
      )}


      {popupMessage && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', borderRadius: '5px', zIndex: '999', textAlign: 'center' }}>
          {popupMessage}
        </div>
      )}
    </div>
  );
};

const buttonStyle = {
  backgroundColor: '#45a049',
  border: 'none',
  color: 'white',
  padding: '15px 32px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  margin: '4px 2px',
  cursor: 'pointer',
  borderRadius: '8px',
};

export default MapPage;
