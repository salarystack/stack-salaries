// Import all required modules
import React from 'react';
import $ from 'jquery';
import { History, Router } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FileInput from 'react-file-input';
import ReactStripeCheckout from '../components/payment/stripe.jsx';
import { loggedIn } from '../auth/auth';
import Logo from '../components/navigation/logo';

class Premium extends React.Component {

  constructor(props) {
    super(props);
    this.state = {clicked: false, loggedIn: loggedIn()};
  }

  toggled() {
    console.log('toggled');
    this.setState({clicked: !this.state.clicked});
  }
  //send email to recruiter
  contactRecruiter(){
    var email = "RecruiterSujin@gmail.com"
    var subj = "Inquiry regarding ";
    var message = "Dear Sujin,"
    window.open("mailto:" + email + "?subject=" + subj + "&body=" + message, "_self");
  };

  render() {

    return (
    <div id="dashboard" className="container results">
      <nav id="resultNav" className="navbar navbar-default navbar-fixed-top">
        <Logo loggedIn={this.state.loggedIn} />
      </nav>


        <h1> Premium Content </h1>

        <p> We match top talent with the world's most innovative companies. </p>
        <p> We've helped thousands of people find their dream jobs. </p>

        <button className="btn btn-secondary"> <ReactStripeCheckout token={() => this.setState({clicked: !this.state.clicked})}>Pay</ReactStripeCheckout> </button>

        {this.state.clicked ?
        <div className="recruiterBox panel panel-default">
        <div className="panel-body">

        <FileInput  name="myImage"
                    accept=".docx,.jpg"
                    placeholder="Upload Resume"
                    className="inputClass"
                    onChange={this.handleChange} />
        <br/>
        <img className="media-object img-circle" src="https://s.gravatar.com/avatar/cc2623f773bcdd3b6b8765c33f1ec5a1?s=200"/>
        <br/>
        <p> Hi, my name is Sujin and I have over 10 years of experience as
         a technical recruiter.  I look forward to working with you! </p>
         <button className="btn btn-default" onClick={this.contactRecruiter.bind(this)} > Contact Recruiter </button>

        </div>
        </div> : null
        }

      </div>
    );
  }
}

export default Premium;