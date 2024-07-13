import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import api from '../../js/Api';
import { toast } from "react-toastify";

export const StatusPost = () => {
    const [userId, setUserId] = useState(null);
    const [postContent, setPostContent] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const cookies = new Cookies();
        const userId = cookies.get('userId');
        setUserId(userId);
    }, []);

    const handlePostChange = (e) => {
        setPostContent(e.target.value);
        setError(null);
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        // Check if post content is not empty
        if (!postContent.trim()) {
            setError('Post content cannot be empty');
            return;
        }
        try {
            const response = await api.post('/uploading-post/', {
                    userId: userId,
                    postContent: postContent,
            });
            
            console.log(response)
            if (response['data']['success'] === true) {
                // Post successful, clear the post content
                setPostContent('');
                toast("Status Updated!");
            } else {
                console.error('Failed to upload post');
            }
        } catch (error) {
            console.error('Error uploading post:', error);
        }
    };

    return (
        <div>
            <h2>My Status</h2>
            <form onSubmit={handlePostSubmit}>
                <textarea
                    value={postContent}
                    onChange={handlePostChange}
                    placeholder="Write your post here..."
                    rows={4}
                    cols={50}
                />
                <br />
                <button type="submit">Post</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
    );
};

