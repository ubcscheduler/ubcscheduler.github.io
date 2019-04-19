import React, { Component } from 'react';
import './css/variables.css';
import './css/fonts.css';
import './css/App.css';
// import './css/layout.css';
import './css/common.css'
import './css/components/logo.css'
import { Provider } from 'react-redux';

import CalendarContainer from './components/CalendarContainer';
import Hamburger from './components/Hamburger';
import SidePanel from './components/SidePanel'
import CalendarIndex from './components/CalendarIndex';
import CalendarTerms from './components/CalendarTerms';


import SavedScheduleContainer from './components/SavedScheduleContainer';


import './css/responsive.css';

import store from './store';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <div className="logo">
            UBC Scheduler
            </div>
          <div className="saved-schedules">
            <SavedScheduleContainer />
          </div>

          <Hamburger
            contentComponent={<SidePanel />} />

          

          <div className="calendar">
            <CalendarTerms />
            <CalendarContainer />
            <CalendarIndex />
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;
