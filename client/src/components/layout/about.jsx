import React from 'react';

const About = React.createClass({
  render: function() {
    return (
      <div className="dashboard center-block text-center">
        <h1 className="feature">About Stack Salary</h1>
        <img className="img-responsive aboutImage" src="https://media.licdn.com/mpr/mpr/p/7/005/075/3bb/1e40bf6.jpg" alt="" />
        <p className="text-center">
          An app for software engineers to post and view anonymous salary info based on their stack and location.
          <br />
          Specify results by selecting comprehensive filters.
          <br />
          If your query didn't return what you expected, browse thru related job postings in the area.
        </p>
      </div>
    );
  }
});

export default About;