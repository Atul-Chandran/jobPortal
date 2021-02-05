import React, { useState,useReducer,useEffect } from "react";
import ReactDOM from 'react-dom';
import '../Styles/employerLogin.css';
import EmployerLogin from './employerLogin';
import Button from 'react-bootstrap/Button';
import App from '../App';
import { initialState, reducer } from "../store/reducer";
import axios from "axios";

const STOCK_URL = "http://localhost:3002/saveEmployerDetails";


const EmployerSignUp = ({ search }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);

  function getData(){
    console.log("GETTIN ",email)
    if(name && email){
      axios.post(STOCK_URL,{name: name,email: email}).then(jsonResponse => {
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
            <EmployerLogin />,
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
  };

  const resetInputField = () => {
    setName("");
    setEmail("");
  };

  function logVal(){
      ReactDOM.render(
        <EmployerLogin />,
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
      <h1><u>Sign Up Page</u></h1>
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

export default EmployerSignUp;
