import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';



ReactDOM.render(

  /*

   This is a little weird. 
   
   Since the game logic file exist outside the project, we need a way to access 
   top level functions in app.js. So we make it available as a global object. 

   Is this dangerous? Adventure gaming has always been dangerous.

   But we're not here to do update state outside of setState or other built-in react things.

   So from anywhere in the app, and espcially an external gameLogic.js file, you
   can access window.reactGameEngine.haltHero() or other funcitons in app.js

   Credit (or discredit?) to https://brettdewoody.com/accessing-component-methods-and-state-from-outside-react/

   */

  // <App ref={(reactGameEngine) => {window.reactGameEngine = reactGameEngine}} />,

  <App />,
  document.getElementById('retroGame')
);
