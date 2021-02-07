import React, { useState,useReducer,useEffect } from "react";
import ReactDOM from 'react-dom';
import '../Styles/styles.css';
import Button from 'react-bootstrap/Button';
import AppliedJobList from './appliedJobList';
import JobPost from './jobPost';
import App from '../App';
import axios from "axios";

const STOCK_URL = "http://localhost:3002/fetchNearbyJobs/latitude/";
const LOCATION_URL = "http://localhost:3002/fetchLocation/email/"

const Nearbyjobs = ({ email }) => {
  const [indicator, setIndicator] = useState(false);
  const [dataValues,setDataValues] = useState([]);
  var latitude = 0;
  var longitude = 0;
  
  if(!email){
    email = localStorage.getItem("email");
  }

  var values = [];

  useEffect(() => {

    axios.get(LOCATION_URL + email).then(jsonResponse => {
        latitude = jsonResponse.data.data[0].latitude;
        longitude = jsonResponse.data.data[0].longitude;
        axios.get(STOCK_URL + latitude + "/longitude/" + longitude).then(jsonResponse => {
            if(jsonResponse.data.data.length === 0){
                setIndicator(true);
            }
            else{
                const data = jsonResponse.data.data.map((data, index) => (
                    values.push(data)
                  ));
                setDataValues(values);
            }
    
    
          });
      });    
  }, []);

  function jobPostRedirection(data){
      ReactDOM.render(
        <JobPost jobData = {data} />,
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

  function jobListRedirecttion(){
    ReactDOM.render(
      <AppliedJobList/>,
      document.getElementById('root')
    );
  }

  return (
    <div>
      <h1><u>Nearby jobs available</u></h1>
      <Button id="viewDetails" variant="success" size="lg" onClick = {jobListRedirecttion}>
            View Jobs applied
      </Button>{' '}

      <Button id="nearbyJobsLogout" variant="danger" size="lg" onClick = {logout}>
            Logout
      </Button>{' '}
      <table>
          <thead>
            <tr>
                <th>SL.No</th>
                <th>Title</th>
                <th>Created By</th>
                <th>Action</th>
                {/* <th>Delete a Job?</th> */}
            </tr>
          </thead>
              {dataValues.length > 0 ?
            dataValues.map((data, index) => (
                <tbody>
                    <td>{index + 1}</td>
                    <td>{data.title}</td>
                    <td>{data.createdBy}</td>
                    <td>
                        <Button id="" variant="primary" size="lg" onClick = {() => jobPostRedirection(data)} >
                            Apply
                        </Button>{' '}
                    </td>
                    {/* <td>2</td> */}
                </tbody>
            ))
              : ""}
      </table>
      {indicator ===  true ?
            <p id = "noDataIndicator">No jobs added yet!!</p> : ""
      }
    </div>

  );
};

export default Nearbyjobs;
