import React, { useState,useEffect } from "react";
import ReactDOM from 'react-dom';
import '../Styles/styles.css';
import AppliedJobList from './appliedJobList';
import JobList from './jobList';
import Button from 'react-bootstrap/Button';
import App from '../App';
import axios from 'axios';

const STOCK_URL = "http://localhost:3002/profileUserUpdate/id/";
const USER_DETAILS = "http://localhost:3002/fetchUserName/email/";
const UPDATE_USER_JOBS = "http://localhost:3002/updateEmailJobs";

const UserUpdate = ({ search }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [userId,setUserId] = useState("");
  const [newName,setNewName] = useState("");
  const [isUpdate,setIsUpdate] = useState(true);
  const existingEmail = localStorage.getItem("email")

  useEffect(() => {
    axios.get(USER_DETAILS + existingEmail).then(jsonResponse => {
        if(jsonResponse.data.status === 200){
            setName(jsonResponse.data.data[0].name)
            setUserId(jsonResponse.data.data[0]["_id"]);
        }
        else{
          alert("This user does not exist");
        }
      });    
  }, []);

  const handleEmailChanges = e => {
    setEmail(e.target.value);
  };

  const handleNameChanges = e => {
    setNewName(e.target.value);
  };

  const resetInputField = () => {
    setEmail("");
  };

  function getOtp(){
      var updateQuery = {};
      if(newName){
          updateQuery["name"] = newName;
      }
      if(email){
          updateQuery["email"] = email;
      }
      axios.post(STOCK_URL + userId , updateQuery).then(jsonResponse => {
        alert("User details saved successfully");
        axios.post(UPDATE_USER_JOBS,{
          currentEmail: existingEmail,
          newEmail: email
          }).then(jsonResponse => {
            localStorage.setItem("email",email)
        });

        if(localStorage.getItem("type") === "Employee"){
            ReactDOM.render(
              <AppliedJobList/>,
              document.getElementById('root')
          );
        }
        else{
            ReactDOM.render(
              <JobList/>,
              document.getElementById('root')
          );
        }
      });

    resetInputField();

  }

  function returnHome(){
    ReactDOM.render(
      <App/>,
      document.getElementById('root')
    );
  }

  function enableUpdate(){
      setIsUpdate(false);
  }

  const handleCheckboxChanges = e => {
    setIsUpdate(!(e.target.checked))
  };

  return (
    <div>
      <h1><u>User Details</u></h1>
      <Button id="homePage" variant="light" size="lg" onClick = {returnHome}>
            Home page
      </Button>{' '}
      <section>
        <p>Name</p>
        <input
            onChange={handleNameChanges}
            placeholder = {name}
            type="text"
            disabled = {isUpdate}
        />
        <p id = "emailUpdate">Email</p>
        <input
            id = "emailInputUpdate"
            onChange={handleEmailChanges}
            placeholder = {localStorage.getItem("email")}
            type="email"
            disabled = {isUpdate}
        />
        <p id = "updateText">Check this to update</p>
        <input
        id = "updateCheckbox"
        type = "checkbox"
        onChange = {handleCheckboxChanges}
        onClick = {enableUpdate}
        />
      </section>

        <input id ="updateButton" onClick={getOtp} type="submit" value="Update" disabled = {isUpdate} required />
    </div>

  );
};

export default UserUpdate;
