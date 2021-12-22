import React from 'react';
import './app.css';
import './stars.css';
import Router from './Router';
import Snackbar from './containers/Snackbar';

const App = () => {
    return (
        <div className="of_community">
            <div id="starfield">
            <div id="stars"></div>
            <div id="stars2"></div>
            <div id="stars3"></div>
        </div>
            <Router/>
            <Snackbar/>
        </div>
    );
};

export default App;
