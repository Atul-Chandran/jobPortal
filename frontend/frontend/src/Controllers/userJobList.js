import React, { useState,useReducer,useEffect } from "react";
import ReactDOM from 'react-dom';
import '../Styles/styles.css';
import Button from 'react-bootstrap/Button';
import JobList from './jobList';
import App from '../App';
import axios from "axios";

const moment = require('moment');

const STOCK_URL = "http://localhost:3002/fetchAppliedJobs?email=";
const UPDATE_STATUS_URL = "http://localhost:3002/updateStatus";
const resumeURL = "http://127.0.0.1:8887/"

const UserJobList = ({ email }) => {
  const [indicator, setIndicator] = useState(false);
  const [dataValues,setDataValues] = useState([]);
  const [jobAppliedTime,setJobAppliedTime] = useState("");
  var values = [];

  if(!email){
    email = localStorage.getItem("email");
  }

  useEffect(() => {
    axios.get(STOCK_URL).then(jsonResponse => {
        var currentDate = moment().unix();
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

  function logVal(jobValue){
      var value = document.getElementById("status");
      axios.post(UPDATE_STATUS_URL,{
          jobId: jobValue["_id"],
          jobStatus: parseInt(value.value)
      }).then(jsonResponse => {
        if(jsonResponse.data.status === 200){
            alert("Status saved successfully");
            ReactDOM.render(
              <JobList/>,
              document.getElementById('root')
            );
        }


      }); 
  }

  function logout(){
    localStorage.removeItem("email");
    localStorage.removeItem("type");
    ReactDOM.render(
      <App/>,
      document.getElementById('root')
    );
  }

  function redirectToJobList(){
    ReactDOM.render(
      <JobList/>,
      document.getElementById('root')
    );
  }

  return (
    <div>
      <h1><u>Jobs applied by user</u></h1>

      <Button id="homePage" variant="danger" size="lg" onClick = {logout}>
            Logout
      </Button>{' '}

      <Button id="jobListRedirection" variant="success" size="lg" onClick = {redirectToJobList}>
            Back to job list
      </Button>{' '}
      <table>
          <thead>
            <tr>
                <th>SL.No</th>
                <th>Title</th>
                <th>Applied By</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Action</th>

                {/* <th>Delete a Job?</th> */}
            </tr>
          </thead>
              {dataValues.length > 0 ?
            dataValues.map((data, index) => (
                <tbody>
                    <td>{index + 1}</td>
                    <td>{data.jobTitle}</td>
                    <td>{data.userEmail}</td>
                    <td><a href={resumeURL + data.resume} target = "_blank">Resume link</a></td>
                    <td>
                        <select name="status" id="status">
                            <option value="2">In-Progress</option>
                            <option value="3">Rejected</option>
                            <option value="4">Shortlisted</option>
                        </select>
                    </td>
                    <td>
                    <Button variant="primary" size="lg" onClick = {() => logVal(data)}>
                            Apply
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

export default UserJobList;
