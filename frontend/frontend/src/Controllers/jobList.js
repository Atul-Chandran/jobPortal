import React, { useState,useReducer,useEffect } from "react";
import ReactDOM from 'react-dom';
import '../Styles/employerLogin.css';
import Button from 'react-bootstrap/Button';
import JobInsertion from './jobInsertion';
import App from '../App'
import UserJobList from './userJobList';
import EmployerUpdate from './employerUpdate';
import axios from "axios";

const STOCK_URL = "http://localhost:3002/fetchJobs/email/";
const EXPIRING_JOB_URL = "http://localhost:3002/expiringJob";

const JobList = ({ email }) => {
  const [indicator, setIndicator] = useState(false);
  const [dataValues,setDataValues] = useState([]);
  if(!email){
    email = localStorage.getItem("email");
  }
  var values = [];

  useEffect(() => {
    axios.get(STOCK_URL + email).then(jsonResponse => {
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
        <JobInsertion email = {email} />,
      document.getElementById('root')
    );
  }

  function listJobsAppliedByUser(){
    ReactDOM.render(
      <UserJobList/>,
      document.getElementById('root')
    );
  }

  function returnHome(values){
    localStorage.removeItem("email");
    localStorage.removeItem("type");
    ReactDOM.render(
      <App/>,
      document.getElementById('root')
    );
  }

  function viewLoginDetails(){
    ReactDOM.render(
      <EmployerUpdate/>,
      document.getElementById('root')
    );
  }

  return (
    <div>
      <h1><u>Job List Posted</u></h1>
      <Button id="addJob" variant="primary" size="lg" onClick = {logVal}>
            Add a Job
      </Button>{' '}

      <Button id = "jobListButton"  variant="primary" size="lg" onClick = {listJobsAppliedByUser}>
            View jobs applied by users
      </Button>{' '}

      <Button id="homePage" variant="light" size="lg" onClick = {returnHome}>
            Logout
      </Button>{' '}
      <Button id="viewDetails" variant="success" size="lg" onClick = {viewLoginDetails}>
            View Details
      </Button>{' '}
      <table>
          <thead>
            <tr>
                <th>SL.No</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Delete a Job?</th>
            </tr>
          </thead>
              {dataValues.length > 0 ?
            dataValues.map((data, index) => (
                <tbody>
                    <td>{index + 1}</td>
                    <td>{data.title}</td>
                    <td>{data.description}</td>
                    <td>{data.status === 1 ? "Job Exists" : "Expired"}</td>
                    <td>
                    <Button variant="danger" size="lg" onClick = {() => {returnHome(data)}}>
                          Yes
                    </Button>{' '}
                    </td>
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

export default JobList;
