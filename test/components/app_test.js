import {React, renderComponent , expect } from '../test_helper';
import App from '../../client/src/containers/app.jsx';
import Search from '../../client/src/components/search/search-input.jsx';
import ReactStripeCheckout from '../../client/src/components/payment/stripe.jsx';
import Premium from '../../client/src/containers/premium.jsx';
import localStorage from 'local-storage';
import Wrapper from './wrapper.jsx';

describe('Main Page', () => {
  let component;
  let search;

  beforeEach(() => {
    component = React.createElement(App);
    search = React.createElement(Search);
  });

  it('renders the app', () => {
    expect(component).to.exist;
  });

  it('renders the search bar', () => {
    expect(search).to.exist;
  });  
});

describe('Premium Page', () => {
  let payment;
  let premium;

  beforeEach(() => {
    payment = React.createElement(ReactStripeCheckout);
    premium = React.createElement(Premium);
  });

  it('renders the payment box', () => {
    expect(payment).to.exist;
  });

  it('renders the premium parent component', () => {
    expect(premium).to.exist;
  });  

  it('should be a stateful functional component', function() {
    expect(React.Component.isPrototypeOf(Premium)).to.be.true;
  });

  it('should start off in an unclicked state', function() {

    expect(premium).to.be.exist;
  });

});