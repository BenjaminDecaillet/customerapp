import React, { Component } from 'react';
import './App.css';
import Customerlist from './components/customerlist';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Customer and Trainings</h2>
        </header>
        <Customerlist  />
      </div>
    );
  }
}

export default App;
