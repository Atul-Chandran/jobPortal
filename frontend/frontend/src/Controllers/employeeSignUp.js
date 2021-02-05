import React, { useState,useReducer,useEffect } from "react";
import ReactDOM from 'react-dom';
import '../Styles/employerLogin.css';
import EmployeeLogin from './employeeLogin';
import Button from 'react-bootstrap/Button';
import App from '../App';
import { initialState, reducer } from "../store/reducer";
import axios from "axios";

const STOCK_URL = "http://localhost:3002/saveUserDetails";

const EmployeeSignUp = ({ search }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);
  const [latitude,setLatitude] = useState("");
  const [longitude,setLongitude] = useState("");

  function getData(){
    console.log("Get data");
    console.log("BAME ",name)
    var userLatitude = 0;
    var userLongitude = 0;
    if(name && email){

      axios.post(STOCK_URL,{
        name: name,
        email: email,
        latitude:latitude,
        longitude: longitude
      }).then(jsonResponse => {
        console.log("Onject ",jsonResponse)
        if(jsonResponse.data.status === 200){
          dispatch({
            type: "SEARCH_STOCK_SUCCESS",
            payload: {
              data: jsonResponse.data,
              email: email
            }
          });

          alert("Record successfully added. Please login now");

          ReactDOM.render(
            <EmployeeLogin />,
            document.getElementById('root')
          );
        }

      });
    }
    // e.preventDefault();
    console.log("State value ",state)
    resetInputField();
  }

  const handleNameChanges = e => {
    setName(e.target.value);
  };

  const handleEmailChanges = e => {
    setEmail(e.target.value);
    window.navigator.geolocation.getCurrentPosition(function(position){
      console.log("Position ",position)
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  };

  const resetInputField = () => {
    setName("");
    setEmail("");
  };

  function logVal(){
      ReactDOM.render(
        <EmployeeLogin />,
      document.getElementById('root')
    );
  }

  function returnHome(){
    ReactDOM.render(
      <App/>,
      document.getElementById('root')
    );
  }

  return (
    <div>
      <h1><u>Employee Sign Up Page</u></h1>
      <Button id="homePage" variant="light" size="lg" onClick = {returnHome}>
            Home page
      </Button>{' '}
      <h4 id = "name">Add your name</h4>
        <input
          id = "nameEntry"
          value={name}
          onChange={handleNameChanges}
          type="email"
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
        <span id = "loginRedirect"><b>Back to </b> <a onClick = {logVal} ><u>Login</u></a></span>
    </div>

  );
};

export default EmployeeSignUp;
