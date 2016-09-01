import React from 'react';

const Main = React.createClass({
  render: function() {
    return (
      <div>

        <p>Dear User,</p>
        <p>Due to our site's recent launch, there is only meaningful data for javascript technologies in Boston, MA.
          Please search JS tech stacks in Boston to fully appreciate the site's features including data visualization.
            More cities and tech stacks are on the way!</p>

        <h1 className="feature">Stack Salaries</h1>
        <p className="text-center">An app for software engineers to post and view anonymous salary info based on their stack and location.</p>
      </div>
    );
  }
});

export default Main;
