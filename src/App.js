import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Customerlist from './components/Customerlist';
import TrainingList from './components/Traininglist';
import Calendar from './components/Calendar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const Index = () => (<Customerlist />);
const TrainingsList = () => (<TrainingList />);
const CalendarPage = () => (<Calendar />)

class App extends Component {
  render() {
    return (

      <Router>
        <div className="App">
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h4" color="inherit" style={{ flexGrow: 1, alignContent: 'middle' }}>
                Customers and Trainings
            </Typography>
              <Button variant="outlined" href="/" aria-label="Customers" style={{ margin: 4 , color:'white'}}>
                Customers
            </Button>
            <Button variant="outlined" href="/trainings/" aria-label="Customers" style={{ margin: 4, color:'white' }}>
                Trainings
            </Button>
            <Button variant="outlined" href="/calendar/" aria-label="Calendar" style={{ margin: 4, color:'white' }}>
                Calendar
            </Button>
            </Toolbar>
          </AppBar>

          <Route path="/" exact component={Index} />
          <Route path="/trainings/" component={TrainingsList} />
          <Route path="/calendar/" component={CalendarPage} />
        </div>
      </Router>
    );
  }
}

export default App;
