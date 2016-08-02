import React from 'react';
import $ from 'jquery';

class Contact extends React.Component{
  constructor (props) {
    super(props);
    this.state = {
      contactName : 'Jane',
      contactEmail: 'email',
      contactMessage: 'I have a question',
      showFeedback: false
    }
  }

  contactNameChange (e) {
    this.setState({
      contactName: e.target.value
    })
  }

  contactEmailChange (e) {
    this.setState({
      contactEmail: e.target.value.toLowerCase()
    })
  }

  contactMessageChange (e) {
    this.setState({
      contactMessage: e.target.value.toLowerCase()
    })
  }

  sendContactMessage (e) {
    $.ajax({
      url:'/api/contact',
      type: 'POST',
      data: { message: JSON.stringify(this.state.contactMessage), email: JSON.stringify(this.state.contactEmail) },
      success: function() {
        this.setState({
          showFeedback: true
        })
      }.bind(this),
      error: function() {
        console.log('ajax sent failed!')
      }
    })
  }

  render () {
    return (
      <div className="dashboard center-block text-center">
        <h1 className="feature">Contact us</h1>
        <p className="text-center">Have suggestions or questions for us?</p>
        <form className="flexcontainer" >
          <fieldset className="form-group row gray">
            <div className="col-sm-1">
              <span className="glyphicon glyphicon-user"></span>
            </div>
            <div className="col-sm-11">
              <input type="text" className="form-control" placeholder="Name" onChange={this.contactNameChange.bind(this)}/>
            </div>
          </fieldset>
          <fieldset className="form-group row gray">
            <div className="col-sm-1">
              <span className="glyphicon glyphicon-envelope"></span>
            </div>
            <div className="col-sm-11">
              <input type="email" className="form-control" placeholder="Email" onChange={this.contactEmailChange.bind(this)}/>
            </div>
          </fieldset>
          <fieldset className="form-group row gray">
            <div className="col-sm-1">
              <span className="glyphicon glyphicon-pencil"></span>
            </div>
            <div className="col-sm-11">
              <textarea className="form-control" rows="4" placeholder="Write message here..." onChange={this.contactMessageChange.bind(this)}/>
            </div>
          </fieldset>
        </form>
          <button className="btn btn-primary" onClick={this.sendContactMessage.bind(this)}>Submit</button>
          {this.state.showFeedback ? <p> {this.state.contactName}, Thank you for the message! <br /> We will get back to you as soon as possible! </p> : null }
      </div>
    );
  }
}

export default Contact;