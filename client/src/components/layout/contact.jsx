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
              <input type="text" />
            </div>
          </div>
        </form>
      </div>
    );
  }
});

export default Contact;