import React from 'react';

const Contact = React.createClass({
  render: function() {
    return (
      <div>
        <h1 className="feature">Contact us</h1>
        <p className="text-center">Have suggestions or questions for us?</p>
        <form>
          <div className="form-group">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Name" />
            </div>
          </div>
          <div className="form-group">
            <div className="input-group">
              <input type="email" className="form-control" placeholder="Email" />
            </div>
          </div>
          <div className="form-group">
            <div className="input-group">
              <textarea className="form-control" rows="4" defaultValue="Write message here..." />
            </div>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-default">Send</button>
          </div>
        </form>
      </div>
    );
  }
});

export default Contact;