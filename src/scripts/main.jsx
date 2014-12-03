/** @jsx React.DOM */

var React = require('react'),
    TweetsApp = React.createFactory(require('./TweetsApp.jsx'));

// var {DefaultRoute, Route, Routes} = require('react-router');
// var routes = module.exports = (
//   <Routes location="history">
//     <Route path="/" handler={TweetsApp}>
//     </Route>
//   </Routes>
// );

if (typeof window === 'object') {// client side things
  var initialStateElem = document.getElementById('initial-state'),
      initialState = initialStateElem && JSON.parse(unescape(initialStateElem.textContent)) || {};

  React.render((
    TweetsApp(initialState)
  ), document.getElementById('react-hole'));
}
