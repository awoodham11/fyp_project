import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../js/Api';
import { Link } from 'react-router-dom';

export const Newsfeed = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/all-posts');
                if (response.data && Array.isArray(response.data.posts)) {
                    setPosts(response.data.posts);
                } else {
                    console.error('Invalid response format:', response.data);
                    toast.error('Failed to fetch posts');
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to fetch posts');
            }
        };
        
        fetchPosts();
    }, []);


    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1 style={{ marginBottom: '20px' }}>News Feed</h1>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {posts.map((post, index) => (
                    <div key={index} style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }}>
                        <div style={{ border: '1px solid #000', borderRadius: '10px', padding: '10px', backgroundColor: '#fff' }}>
                            <Link to={'/user/' + post.username}>
                            <strong style={{ color: '#000', marginBottom: '10px', display: 'block', fontWeight: 'bold', fontSize: '1.2em', textAlign: 'left' }}>
                                @{post.username} :</strong> </Link>
                            <div style={{ color: '#000', wordWrap: 'break-word', fontSize: '1em' }}>{post.content}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
