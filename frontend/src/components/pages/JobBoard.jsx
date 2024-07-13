import React, { useEffect, useState } from "react";
import api from "../../js/Api"
import axios from 'axios';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";


export const JobBoard = () => {
    const [jobs, setJobs] = useState([]);
    const [newJob, setNewJob] = useState({
        company_name: '',
        title: '',
        description: '',
        location: ''
    });

    useEffect(() => {
        api.get('/job-listings')
        .then((res) => {
            console.log(res.data.posts);
            setJobs(res.data.posts)
        })
        .catch((err) => {
            if(axios.isCancel(err)){
                console.log("cancelled")
            } else {
                console.log(err)
            }
        });
    }, []);


    return (
        <div  style={{border: '1px solid white', borderRadius: '20px', padding: '10px'}} >
            <div style={{ textAlign: 'center', padding: '20px'}}>
                <h1 style={{ marginBottom: '20px' }}>Job Board</h1>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {jobs.map((job, index) => (
                        <div key={index} style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }}>
                            <div style={{ border: '1px solid #000', borderRadius: '10px', padding: '10px', backgroundColor: '#fff' }}>
                                    <Link to={'/user/' + job.username}>
                                    <strong style={{ color: '#000', marginBottom: '10px', display: 'block', fontWeight: 'bold', fontSize: '1.2em', textAlign: 'left' }}>
                                    @{job.username}:</strong></Link>
                                <div style={{ color: '#000', wordWrap: 'break-word', fontSize: '1em' }}>
                                    Title: <br/>{job.title}</div><br/>
                                <div style={{ color: '#000', wordWrap: 'break-word', fontSize: '1em' }}>
                                    Location: <br/>{job.location}</div><br/>
                                <div style={{ color: '#000', wordWrap: 'break-word', fontSize: '1em' }}>
                                    Job Description: <br/>{job.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <Link to={`/post-job`} className="link-btn">
                    Post a job here</Link>  
            </div>
        </div>

    );
};
