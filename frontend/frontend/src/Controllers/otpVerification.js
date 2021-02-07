import React, { useState,useReducer,useEffect } from "react";
import ReactDOM from 'react-dom';
import '../Styles/styles.css';
import EmployerLogin from './employerLogin';
import JobList from './jobList';
import AppliedJobList from "./appliedJobList";
import { initialState, reducer } from "../store/reducer";
import axios from "axios";

const STOCK_URL = "http://localhost:3002/otpValidityCheck";


const OtpPage = ({ email }) => {
  const [otp, setOtp] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);

  function getData(){
    if(otp){
      axios.post(STOCK_URL,{email: email.email,otp: otp}).then(jsonResponse => {
        if(jsonResponse.data.status === 200){
          localStorage.setItem("email",email.email);
          localStorage.setItem("type",email.type)
          alert("Login successful. Redirecting you to dashboard");

          if(email.type === "Employee"){
            ReactDOM.render(
              <AppliedJobList email = {email.email} />,
              document.getElementById('root')
            );
          }
          else{
            ReactDOM.render(
              <JobList email = {email.email} />,
              document.getElementById('root')
            );
          }
        }
        else{
            alert("Incorrect OTP");
        }

      });
    }
  }

  const handleNameChanges = e => {
    setOtp(e.target.value);
  };

  return (
    <div>
      <h1><u>OTP Verification Page</u></h1>
      <h4 id = "otpHeading">Enter the OTP you received on your email</h4>
        <input
          id = "otpEntry"
          value={otp}
          onChange={handleNameChanges}
          type="email"
        />
        <input id ="otpSignup" onClick={getData} type="submit" value="Log in" required/>
    </div>

  );
};

export default OtpPage;
