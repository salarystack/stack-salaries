import React from 'react';
import { Link } from 'react-router';

const Footer = React.createClass({
  render: function() {
    return(
      <div className="footer center-block text-center">
        <div className="row">
          <ul className="list-inline">
            <li><Link to='/'>Home</Link> </li>
            <li><Link to='/about'>About</Link> </li>
             <li><Link to='/team'>Team Mewtwo</Link></li>
             <li><Link to='/contact'>Contact</Link></li>
          </ul>
          <p className="lead">&copy; 2016 Salary Stack</p>
        </div>
      </div>
    );
  }
});


export default Footer;
