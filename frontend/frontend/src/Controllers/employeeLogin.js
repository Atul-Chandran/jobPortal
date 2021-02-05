import React, { useState,useReducer } from "react";
import ReactDOM from 'react-dom';
import '../Styles/employerLogin.css';
import EmployeeSignUp from './employeeSignUp';
import OtpPage from './otpVerification';
import Button from 'react-bootstrap/Button';
import App from '../App';
import { initialState, reducer } from "../store/reducer";
import axios from 'axios';

const STOCK_URL = "http://localhost:3002/createEmployeeOtp";

const EmployeeLogin = ({ search }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [email, setEmail] = useState("");

  const handleEmailChanges = e => {
    setEmail(e.target.value);
  };

  const resetInputField = () => {
    setEmail("");
  };

  function logVal(){
      ReactDOM.render(
        <EmployeeSignUp />,
      document.getElementById('root')
    );
  }

  function getOtp(){
    if(email){
      axios.post(STOCK_URL,{emailId: email}).then(jsonResponse => {
        if(jsonResponse.data.status == 200){
          var data = {email: email, type: "Employee"}

          ReactDOM.render(
            <OtpPage email = {data} />,
            document.getElementById('root')
          );
        }
        else{
          alert("Are you sure the right email ID was entered?");
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
      <h1><u>Employee Login Page</u></h1>
      <Button id="homePage" variant="light" size="lg" onClick = {returnHome}>
            Home page
      </Button>{' '}
      <h4>Enter your email address</h4>
      <input
        id = "emailLogin"
        value={email}
        onChange={handleEmailChanges}
        placeholder = "Ex:- abc@gmail.com"
        type="email"
      />
        <input id ="button" onClick={getOtp} type="submit" value="Log In" required/>
        <span><b>Are you new here? Please </b> <a onClick = {logVal} ><u>Sign Up</u></a></span>
    </div>

  );
};

export default EmployeeLogin;
