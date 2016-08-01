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

      <div className="row under-nav">

        <div className= "gray-box panel panel-default">

        <div className="row dashboard-row center-block panel-body">
          <h1>Welcome to the Job Search <span className="color">{window.localStorage.name}</span></h1>

        </div>

        </div>
      </div>

        <p> We match top talent with the world's most innovative companies. </p>
        <p> We've helped thousands of people find their dream jobs. </p>
        <img className="recruitImg" src="http://i.imgur.com/jtVH5QF.png"/>

        <button className="btn btn-default"> <ReactStripeCheckout token={() => this.setState({clicked: !this.state.clicked})}>Join us today!</ReactStripeCheckout> </button>
        <br />

        {this.state.clicked ?
        <div className="recruiterBox panel panel-default">
          <div className="panel-body">
          <br />
          <img className="recruiterPic media-object img-circle" src="https://s.gravatar.com/avatar/cc2623f773bcdd3b6b8765c33f1ec5a1?s=200" />
          <p className="text-center"> Hi, my name is Sujin and I have over 10 years of experience <br /> as a technical recruiter.  I look forward to working with you! </p>
          <img className="recruitImgTwo" src="http://i.imgur.com/VpBGZco.png"/>


          <br />

          <button className="btn btn-default" onClick={this.contactRecruiter.bind(this)} > Contact Recruiter </button>
          <input type="file"> </input>


          </div>
        </div> : null
        }

      </div>
    );
  }
}

export default Premium;