import React, { useEffect, useState } from "react";
import api from "../../js/Api"
import axios from 'axios';
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import "../../css/PostJob.css"
import { Link, useNavigate, useParams } from "react-router-dom";


export const PostJob = () => {
    const [jobs, setJobs] = useState([]);
    const [newJob, setNewJob] = useState({
        company_name: '',
        title: '',
        description: '',
        location: '',
        sender: '',
    });

    const id = useParams()
    console.log(id)
    const cookies = new Cookies();
    const userId = cookies.get('userId');
    console.log(userId)
    

    const navigate = useNavigate();

    const handleChange = (e) => {
        setNewJob({...newJob, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const jobData = {
            ...newJob,
            userId: userId, 
        };
        api.post('/post-job/', jobData)
        .then((res) => {
            setNewJob({
                company_name: '',
                title: '',
                description: '',
                location: '',
                sender: '', 
            });
            navigate('/job-board');
        }).catch((err) => {
            console.log(err);
        });
    };

    return (
        <div className="page-container">
            <div>
                <h1>Post a Job</h1>
            </div>
            <div className="post-job-container">
                <form onSubmit={handleSubmit}>
                    <input type="text" name="company_name" placeholder="Company Name" onChange={handleChange} />
                    <input type="text" name="title" placeholder="Job Title" onChange={handleChange} />
                    <textarea name="description" placeholder="Job Description" onChange={handleChange} />
                    <input type="text" name="location" placeholder="Location" onChange={handleChange} />
                    <button type="submit">Post Job</button>
                </form>
            </div>
            <div>
                <Link to={`/job-board`} className="link-btn">
                       Go to Job Board</Link>
            </div>
            
        </div>
    );
}
