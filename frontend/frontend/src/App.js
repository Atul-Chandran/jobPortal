import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import EmployerCreation from './Controllers/employerLogin'
import EmployeeLogin from './Controllers/employeeLogin';
import AppliedJobList from './Controllers/appliedJobList';
import JobList from './Controllers/jobList';

import './App.css';

function redirectUrl(){
  ReactDOM.render(
      <EmployerCreation />,
    document.getElementById('root')
  );
}

function employeePage(){
  ReactDOM.render(
      <EmployeeLogin />,
    document.getElementById('root')
  );
}

function App() {
  return (
    <div>
      {
        localStorage.getItem("email") && localStorage.getItem("type") === "Employee" ? 
          <AppliedJobList/>:
          (localStorage.getItem("type") === "Employer") ? <JobList/>:
          <div className="App">
          <header className="App-header">
            <code>
              Which among the below are you?
            </code>
            <Button id="employer" variant="primary" size="lg" onClick = {redirectUrl}>
                Employer
            </Button>{' '} 
            <Button id="user" variant="primary" size="lg" onClick = {employeePage}>
                Employee
            </Button>{' '}
          </header>
        </div>
      }
    </div>
  );
}

export default App;
