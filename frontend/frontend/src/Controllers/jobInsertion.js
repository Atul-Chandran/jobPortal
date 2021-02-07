import React, { useState,useReducer,useEffect } from "react";
import ReactDOM from 'react-dom';
import '../Styles/styles.css';
import JobList from './jobList';
import App from '../App';
import Button from 'react-bootstrap/Button';
import { initialState, reducer } from "../store/reducer";
import axios from "axios";
import DatePicker from 'react-date-picker';

const ADD_JOB_URL = "http://localhost:3002/addJob";

const JobInsertion = ({ email }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [expireDate,setExpireDate] = useState("");
  const [date,setDate] = useState("");
  const [latitude,setLatitude] = useState("");
  const [longitude,setLongitude] = useState("");

  function addJob(){
    if(name && description && expireDate){
      axios.post(ADD_JOB_URL,{
          title: name,
          description: description,
          latitude: latitude,
          longitude: longitude,
          expireDate: expireDate,
          createdBy: email
      }).then(jsonResponse => {
        if(jsonResponse.data.status === 200){
        
          alert("Job created successfully");

          ReactDOM.render(
            <JobList email = {email} />,
            document.getElementById('root')
          );
        }

      });
    }
    resetInputField();
  }

  const handleNameChanges = e => {
    setName(e.target.value);
  };

  const handleDescription = e => {
    setDescription(e.target.value);
  };


  const handleExpireDate = e => {
      var expiryTimeInSeconds = new Date(e).getTime()/1000;
      window.navigator.geolocation.getCurrentPosition(function(position){
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
      });
      setExpireDate(expiryTimeInSeconds);
  };

  const resetInputField = () => {
    setName("");
    setDescription("");
  };

  function logout(){
    localStorage.removeItem("email");
    localStorage.removeItem("type");
    ReactDOM.render(
      <App/>,
      document.getElementById('root')
    );
  }

  function fetchJobs(){
      ReactDOM.render(
        <JobList />,
      document.getElementById('root')
    );
  }

  return (
    <div>
      <h1><u>Add a Job</u></h1>
      <Button id="addJob" variant="primary" size="lg" onClick = {fetchJobs}>
            View Jobs
      </Button>{' '}

      <Button id="addJobLogout" variant="danger" size="lg" onClick = {logout}>
            Logout
      </Button>{' '}
      <h4 id = "name">Title</h4>
        <input
          id = "nameEntry"
          value={name}
          onChange={handleNameChanges}
          type="text"
        />
      <h4 id = "description">Description</h4>
        <input
          id = "descriptionEntry"
          value={description}
          onChange={handleDescription}
          type="text"
        />

        <h4 id = "expireDate">Expire Date</h4>
            <DatePicker
            id = "dateEntry"
            onChange={handleExpireDate}
            value = {date}
            />
        <input id ="addingJob" onClick={addJob} type="submit" value="Add Job" required/>
    </div>

  );
};

export default JobInsertion;
