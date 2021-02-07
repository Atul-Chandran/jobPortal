import React, { useState,useReducer } from "react";
import ReactDOM from 'react-dom';
import '../Styles/styles.css';
import EmployerSignUp from './employerSignUp';
import OtpPage from './otpVerification';
import Button from 'react-bootstrap/Button';
import App from '../App';
import { initialState, reducer } from "../store/reducer";
import axios from 'axios';

const CREATE_OTP_URL = "http://localhost:3002/createOtp";

const EmployerLogin = ({ }) => {
  const [email, setEmail] = useState("");

  const handleEmailChanges = e => {
    setEmail(e.target.value);
  };

  const resetInputField = () => {
    setEmail("");
  };

  function signup(){
      ReactDOM.render(
        <EmployerSignUp />,
      document.getElementById('root')
    );
  }

  function getOtp(){

    // If a valid email was entered
    if(email){
      axios.post(CREATE_OTP_URL,{emailId: email}).then(jsonResponse => {
        if(jsonResponse.data.status == 200){

          // Sending the email and type to forthcoming pages for easier reference
          var data = {email: email, type: "Employer"}

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
      <h1><u>Login Page</u></h1>
      <Button id="homePage" variant="danger" size="lg" onClick = {logout}>
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
        <span><b>Are you new here? Please </b> <a onClick = {signup} ><u>Sign Up</u></a></span>
    </div>

  );
};

export default EmployerLogin;
