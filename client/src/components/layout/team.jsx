import React from 'react';

const Team = React.createClass({
  render: function() {
    return (
      <div className="panel-body">
        <h1 className="feature">Team</h1>
        <div className="media">
          <div className="media-left">
            <img className="media-object img-circle" src="https://s32.postimg.org/dmi9webdt/mark.jpg" alt="" />
          </div>
          <div className="media-body">
            <h2 className="media-heading">Mark Pruett</h2>
            <p>Product Owner</p>
          </div>
        </div>

        <div className="media">
          <div className="media-left">
            <img className="media-object img-circle" src="https://s32.postimg.org/nvar27zfl/chris.png" alt="" />
          </div>
          <div className="media-body">
            <h2 className="media-heading">Chris Heo</h2>
            <p>Scrum Master</p>
          </div>
        </div>

        <div className="media">
          <div className="media-left">
            <img className="media-object img-circle" src="https://s32.postimg.org/edb026dr5/jeff.jpg" alt="" />
          </div>
          <div className="media-body">
            <h2 className="media-heading">Jeff Lam</h2>
            <p>Lead Engineer</p>
          </div>
        </div>

        <div className="media">
          <div className="media-left">
            <img className="media-object img-circle" src="https://s32.postimg.org/z6deql6ap/sujin.jpg" alt="" />
          </div>
          <div className="media-body">
            <h2 className="media-heading">Sujin Lee</h2>
            <p>Lead Engineer</p>
          </div>
        </div>

      </div>
    );
  }
});

export default Team;