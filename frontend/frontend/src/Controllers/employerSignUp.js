import React, { useState,useReducer } from "react";
import ReactDOM from 'react-dom';
import '../Styles/styles.css';
import EmployerLogin from './employerLogin';
import Button from 'react-bootstrap/Button';
import App from '../App';
import { initialState, reducer } from "../store/reducer";
import axios from "axios";

const SAVE_DETAILS_URL = "http://localhost:3002/saveEmployerDetails";

const EmployerSignUp = ({ search }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function saveDetails(){
    if(name && email){
      axios.post(SAVE_DETAILS_URL,{name: name,email: email}).then(jsonResponse => {
        if(jsonResponse.data.status === 200){
          alert("Record successfully added. Please login now");

          ReactDOM.render(
            <EmployerLogin />,
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
  };

  const resetInputField = () => {
    setName("");
    setEmail("");
  };

  function login(){
      ReactDOM.render(
        <EmployerLogin />,
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
      <h1><u>Sign Up Page</u></h1>
      <Button id="homePage" variant="danger" size="lg" onClick = {logout}>
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
        <input id ="signup" onClick={saveDetails} type="submit" value="Sign Up" required/>
        <span id = "loginRedirect"><b>Back to </b> <a onClick = {login} ><u>Login</u></a></span>
    </div>

  );
};

export default EmployerSignUp;
