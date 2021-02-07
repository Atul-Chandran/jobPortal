import React, { useState,useReducer,useEffect } from "react";
import ReactDOM from 'react-dom';
import '../Styles/styles.css';
import Button from 'react-bootstrap/Button';
import Nearbyjobs from './nearbyJobs';
import UserUpdate from './userUpdate';
import App from '../App';
import axios from "axios";

const moment = require('moment');

const APPLIED_JOBS_URL = "http://localhost:3002/fetchAppliedJobs?email=";


const AppliedJobList = ({ email }) => {
  const [indicator, setIndicator] = useState(false);
  const [dataValues,setDataValues] = useState([]);
  var values = [];

  // Fetching the email from browser storage for page redirection
  if(!email){
    email = localStorage.getItem("email");
  }

  useEffect(() => {
    axios.get(APPLIED_JOBS_URL + email).then(jsonResponse => {
        if(jsonResponse.data.data.length === 0){
            setIndicator(true);
        }
        else{
            jsonResponse.data.data.map((data, index) => (
                values.push(data)
              ));
            setDataValues(values);
        }
      });    
  }, []);

  function navigateToJobs(){
      ReactDOM.render(
        <Nearbyjobs email = {email} />,
      document.getElementById('root')
    );
  }

  // Removing the browser storage
  function logout(){
    localStorage.removeItem("email");
    localStorage.removeItem("type");
    ReactDOM.render(
      <App/>,
      document.getElementById('root')
    );
  }

  function viewLoginDetails(){
    ReactDOM.render(
      <UserUpdate/>,
      document.getElementById('root')
    );
  }

  function returnJobStatus(statusId){
    switch(statusId){
      case 1: return "Pending";
      case 2: return "In-Progress";
      case 3: return "Rejected";
      case 4: return "Shortlisted";
      default: return "None"
    }
  }

  // Returns the time as to when the job was applied
  function returnTimeAppliedOn(time){

    // Seconds conversion
    if(time < 60){
      return time + " seconds back"
    }

    // Minutes conversion
    else if(time >= 60 && time < 3600){
      return Math.round(time/60) + " minutes back"
    }

    // Hours conversion
    else if(time >= 3600 && time < 216000){
      return Math.round(time/3600) + " hours back"
    }

    // Days conversion
    else{
      return Math.round(time/216000) + " days back";
    }

  }

  return (
    <div>
      <h1><u>Applied Job List Posted</u></h1>
      <Button id="newJobApplication" variant="primary" size="lg" onClick = {navigateToJobs}>
            Apply for a job
      </Button>{' '}
      <Button id="viewDetails" variant="success" size="lg" onClick = {viewLoginDetails}>
            View Details
      </Button>{' '}
      <Button id="appliedJobsLogout" variant="danger" size="lg" onClick = {logout}>
            Logout
      </Button>{' '}
      <table>
          <thead>
            <tr>
                <th>SL.No</th>
                <th>Title</th>
                <th>Applied On</th>
                <th>Status</th>
            </tr>
          </thead>
              {dataValues.length > 0 ?
            dataValues.map((data, index) => (
                <tbody>
                    <td>{index + 1}</td>
                    <td>{data.jobTitle}</td>
                    <td>{
                      returnTimeAppliedOn(Math.round(moment().unix() -  new Date(data.jobAppliedOn)))
                    }</td>
                    <td>{returnJobStatus(data.jobStatus)}</td>
                </tbody>
            ))
              : ""}
      </table>
      {indicator ===  true ?
            <p id = "noDataIndicator">No jobs added yet!!</p> : ""
      }
    </div>

  );
};

export default AppliedJobList;
