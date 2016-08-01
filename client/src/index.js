// Import all required modules
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { createStore } from 'redux';

// Import all needed components
import routes from './router';
import { store } from './reducers/combine';
import reducers from './reducers/combine';


// The router is wrapped by the redux provider
ReactDOM.render(( <Provider store={createStore(reducers)}>
  <Router history={browserHistory}>
    {routes}
  </Router>
  </Provider>
), document.getElementById('app'));


// An initialize function for Google Places Auto Complete Feature
// It restricts searches to the US
// This portion can be refactored into another file if needed
function initialize() {
  var options = {
    types: ['(cities)'],
    componentRestrictions: {country: "us"}
  };
  var input1 = document.getElementById('searchTextField');
  var input2 = document.getElementById('advancedSearchTextField');
  if(input1) new google.maps.places.Autocomplete(input1, options);
  if(input2) new google.maps.places.Autocomplete(input2, options);
};

google.maps.event.addDomListener(window, 'load', initialize);