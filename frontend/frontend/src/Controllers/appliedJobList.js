import React, { useState,useReducer,useEffect } from "react";
import ReactDOM from 'react-dom';
import '../Styles/employerLogin.css';
import Button from 'react-bootstrap/Button';
import Nearbyjobs from './nearbyJobs';
import UserUpdate from './userUpdate';
import App from '../App';
import axios from "axios";

const moment = require('moment');

const STOCK_URL = "http://localhost:3002/fetchAppliedJobs?email=";


const AppliedJobList = ({ email }) => {
  const [indicator, setIndicator] = useState(false);
  const [dataValues,setDataValues] = useState([]);
  var values = [];

  if(!email){
    email = localStorage.getItem("email");
  }

  useEffect(() => {
    axios.get(STOCK_URL + email).then(jsonResponse => {
        console.log("Response ",jsonResponse.data);
        console.log("URL ",STOCK_URL + email);
        var currentDate = moment().unix();
        console.log("Current ",currentDate);
        if(jsonResponse.data.data.length === 0){
            setIndicator(true);

        }
        else{
            const data = jsonResponse.data.data.map((data, index) => (
                values.push(data)
              ));
            setDataValues(values);
        }


      });    
  }, []);

  function logVal(){
      ReactDOM.render(
        <Nearbyjobs email = {email} />,
      document.getElementById('root')
    );
  }

  function returnHome(){
    localStorage.removeItem("email");
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

  function returnTimeAppliedOn(time){
    if(time < 60){
      return time + " seconds back"
    }
    else if(time >= 60 && time < 3600){
      return Math.round(time/60) + " minutes back"
    }
    else if(time >= 3600 && time < 216000){
      return Math.round(time/3600) + " hours back"
    }
    else{
      return Math.round(time/216000) + " days back";
    }

  }

  return (
    <div>
      <h1><u>Applied Job List Posted</u></h1>
      <Button id="addJob" variant="primary" size="lg" onClick = {logVal}>
            Apply
      </Button>{' '}
      <Button id="viewEmployeeDetails" variant="success" size="lg" onClick = {viewLoginDetails}>
            View Details
      </Button>{' '}
      <Button id="employeeLogout" variant="light" size="lg" onClick = {returnHome}>
            Logout
      </Button>{' '}
      <table>
          <thead>
            <tr>
                <th>SL.No</th>
                <th>Title</th>
                <th>Applied On</th>
                <th>Status</th>
                {/* <th>Delete a Job?</th> */}
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
                    {/* <td>2</td> */}
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
