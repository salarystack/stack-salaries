// Import all required modules
import React from 'react';
import $ from 'jquery';
import { History, Router } from 'react-router';
import FileInput from 'react-file-input';

class Premium extends React.Component {

  constructor(props) {
    super(props);
  }

  toggle(){
    $(".resumeBtn").unbind('click').click(function() {
      $(".recruiterBox").toggle(function() {
        console.log('toggled');
      });
    });
  }

  contactRecruiter(){
    var email = "RecruiterSujin@gmail.com"
    var subj = "Inquiry regarding ";
    var message = "Dear Sujin,"
    window.open("mailto:" + email + "?subject=" + subj + "&body=" + message, "_self");
  };


  componentWillMount(){
  }

  render() {
    return (

      <div className="row">

        <h1> Premium Content </h1>

        <button className="resumeBtn btn btn-default" onClick={this.toggle.bind(this)}>Resume + Recruiter</button>

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
        </div>
      </div>
    );
  }
}

export default Premium;