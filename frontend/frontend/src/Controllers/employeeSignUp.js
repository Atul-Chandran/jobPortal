import React, { useState,useReducer,useEffect } from "react";
import ReactDOM from 'react-dom';
import '../Styles/styles.css';
import EmployeeLogin from './employeeLogin';
import Button from 'react-bootstrap/Button';
import App from '../App';
import { initialState, reducer } from "../store/reducer";
import axios from "axios";

const SAVE_DETAILS_URL = "http://localhost:3002/saveUserDetails";

const EmployeeSignUp = ({ search }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);
  const [latitude,setLatitude] = useState("");
  const [longitude,setLongitude] = useState("");

  function getData(){
    if(name && email){

      axios.post(SAVE_DETAILS_URL,{
        name: name,
        email: email,
        latitude:latitude,
        longitude: longitude
      }).then(jsonResponse => {
        if(jsonResponse.data.status === 200){

          alert("Record successfully added. Please login now");

          ReactDOM.render(
            <EmployeeLogin />,
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

  const handleEmailChanges = e => {
    setEmail(e.target.value);
    window.navigator.geolocation.getCurrentPosition(function(position){

      // Determining the user's location for nearby jobs
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  };

  const resetInputField = () => {
    setName("");
    setEmail("");
  };

  function login(){
      ReactDOM.render(
        <EmployeeLogin />,
      document.getElementById('root')
    );
  }

  function logout(){
    localStorage.removeItem("email");
    localStorage.removeItem("type");
    ReactDOM.render(
      <App/>,
      document.getElementById('root')
    );
  }

  return (
    <div>
      <h1><u>Employee Sign Up Page</u></h1>
      <Button id="homePage" variant="danger" size="lg" onClick = {logout}>
            Home page
      </Button>{' '}
      <h4 id = "name">Add your name</h4>
        <input
          id = "nameEntry"
          value={name}
          onChange={handleNameChanges}
          type="text"
        />
      <h4 id = "email">Add a new email address</h4>
        <input
          id = "emailEntry"
          value={email}
          onChange={handleEmailChanges}
          placeholder = "Ex:- abc@gmail.com"
          type="email"
        />
        <input id ="signup" onClick={getData} type="submit" value="Sign Up" required/>
        <span id = "loginRedirect"><b>Back to </b> <a onClick = {login} ><u>Login</u></a></span>
    </div>

  );
};

export default EmployeeSignUp;
