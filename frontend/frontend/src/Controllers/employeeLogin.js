import React, { useState,useReducer } from "react";
import ReactDOM from 'react-dom';
import '../Styles/styles.css';
import EmployeeSignUp from './employeeSignUp';
import OtpPage from './otpVerification';
import Button from 'react-bootstrap/Button';
import App from '../App';
import { initialState, reducer } from "../store/reducer";
import axios from 'axios';

const CREATE_EMPLOYEE_OTP = "http://localhost:3002/createEmployeeOtp";

const EmployeeLogin = ({ }) => {
  const [email, setEmail] = useState("");

  const handleEmailChanges = e => {
    setEmail(e.target.value);
  };

  const resetInputField = () => {
    setEmail("");
  };

  // Navigates to employee sign up page
  function employeeSignUp(){
      ReactDOM.render(
        <EmployeeSignUp />,
      document.getElementById('root')
    );
  }

  function getOtp(){

    // If a valid email is entered
    if(email){
      axios.post(CREATE_EMPLOYEE_OTP,{emailId: email}).then(jsonResponse => {
        if(jsonResponse.data.status == 200){
          var data = {email: email, type: "Employee"}

          // Sending the email and type to forthcoming pages for easier reference
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
      <h1><u>Employee Login Page</u></h1>
      <Button id="employeeHomePageButton" variant="danger" size="lg" onClick = {logout}>
            Home Page
      </Button>{' '}
      <h4 id = "employee">Enter your email address</h4>
      <input
        id = "employeeEmailLogin"
        value={email}
        onChange={handleEmailChanges}
        placeholder = "Ex:- abc@gmail.com"
        type="email"
      />
        <input id ="employeeLogin" onClick={getOtp} type="submit" value="Log In" required/>
        <span id = "employeeSignUp"><b>Are you new here? Please </b> <a onClick = {employeeSignUp} ><u>Sign Up</u></a></span>
    </div>

  );
};

export default EmployeeLogin;
