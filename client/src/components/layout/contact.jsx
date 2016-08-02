import React from 'react';

const Contact = React.createClass({
  render: function() {
    return (
      <div className="dashboard center-block text-center">
        <h1 className="feature">Contact us</h1>
        <p className="text-center">Have suggestions or questions for us?</p>
        <form className="flexcontainer">
          <fieldset className="form-group row gray">
            <div className="col-sm-1">
              <span className="glyphicon glyphicon-user"></span>
            </div>
            <div className="col-sm-11">
              <input type="text" className="form-control" placeholder="Name" />
            </div>
          </fieldset>
          <fieldset className="form-group row gray">
            <div className="col-sm-1">
              <span className="glyphicon glyphicon-envelope"></span>
            </div>
            <div className="col-sm-11">
              <input type="email" className="form-control" placeholder="Email" />
            </div>
          </fieldset>
          <fieldset className="form-group row gray">
            <div className="col-sm-1">
              <span className="glyphicon glyphicon-pencil"></span>
            </div>
            <div className="col-sm-11">
              <textarea className="form-control" rows="4" defaultValue="Write message here..." />
            </div>
          </fieldset>
        <div className="row">
          <button type="submit" className="btn btn-primary"> <span className="glyphicon glyphicon-send"></span>Submit</button>
        </div>
        </form>
      </div>
    );
  }
});

export default Contact;