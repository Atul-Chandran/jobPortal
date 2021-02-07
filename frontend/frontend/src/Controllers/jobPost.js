import React, { useState,useReducer } from "react";
import ReactDOM from 'react-dom';
import '../Styles/styles.css';
import NearbyJobs from './nearbyJobs';
import JobList from './jobList';
import AppliedJobList from './appliedJobList';
import App from '../App';
import axios from 'axios';

const STOCK_URL = "http://localhost:3002/saveUserJobDetails";
const moment = require('moment');

const JobPost = ({ jobData }) => {
  const [email, setEmail] = useState("");
  const [resume,setResume] = useState("");
  const [fileUploaded,setFileUploaded] = useState(false);

  const expireDate = new Date(jobData.expireDate * 1000);

  const handleFileChanges = e => {
      setResume(e.target.files[0]);
  };

  function fileUpload(){

    if(resume){
        setFileUploaded(true);
        const profile = new FormData();
        profile.append('file', resume);
        axios.post("http://localhost:3002/upload", profile, { 
        })
        .then(res => { // then print response status
            if(res.status === 200){
                alert("File uploaded successfully");
            }
        })
    }
    else{
        alert("Please upload your resume");
    }
  }


  const resetInputField = () => {
    setEmail("");
  };

  function logVal(){
      ReactDOM.render(
        <NearbyJobs />,
      document.getElementById('root')
    );
  }

  function applyJob(){
    var email = localStorage.getItem("email");
    if(fileUploaded){
      axios.post(STOCK_URL,{
          userEmail: email,
          jobId: jobData["_id"],
          jobTitle: jobData.title,
          appliedOn: moment().unix(),
          resume: resume.name,
          status: 1

      }).then(jsonResponse => {
        if(jsonResponse.data.status === 200){
            alert("Job applied successfully");
            if(localStorage.getItem("type") === "Employee"){
                ReactDOM.render(
                  <AppliedJobList />,
                document.getElementById('root')
              );
            }
            else{
              ReactDOM.render(
                  <JobList />,
                document.getElementById('root')
              );
            }
            
        }

      });

    }
    resetInputField();

  }

  function returnHome(){
    ReactDOM.render(
      <App/>,
      document.getElementById('root')
    );
  }

  return (
    <div>
      <h1><u>Job Post</u></h1>
      <table id = "jobDesc">
          <tbody>
              <tr>
                <td><b>Job Title</b></td>
                <td>{jobData.title}</td>
              </tr>
              <tr>
                <td><b>Job Description</b></td>
                <td>{jobData.description}</td>
              </tr>
              <tr>
                  <td><b>Job Expiry Date</b></td>
                  <td>{expireDate.getDate()}/{expireDate.getMonth()}/{expireDate.getFullYear()}</td>
              </tr>
              <tr>
                  <td><b>Upload your resume</b></td>
                  <td>
                <input type="file" name = "file" onChange={handleFileChanges} encType="multipart/form-data"/>
                <button onClick = {fileUpload}>
                  Upload Resume
                </button>
                    </td>
              </tr>
          </tbody>
      </table>

        <input id ="applyJob" onClick={applyJob} type="submit" value="Apply" required/>
        <span id = "jobList"><b>Wish to return back to job list? Click here </b> <a onClick = {logVal} ><u>Job List</u></a></span>
    </div>

  );
};

export default JobPost;
