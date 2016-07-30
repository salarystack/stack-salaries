// Import all required modules
import React from 'react';
import $ from 'jquery';
import { History, Router } from 'react-router';
import FileInput from 'react-file-input';

class Premium extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount(){
  }

  render() {
    return (
      <div className="row">
        <button>Resume + Recruiter</button>
        <form>
           <FileInput name="myImage"
                      accept=".png,.gif"
                      placeholder="My Image"
                      className="inputClass"
                      onChange={this.handleChange} />
        </form>
      </div>
    );
  }
}

export default Premium;