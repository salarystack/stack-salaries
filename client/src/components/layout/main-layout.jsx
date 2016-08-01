import React from 'react';
import Footer from './footer';

const MainLayout = React.createClass({
  render: function() {
    return (
      <div>
        <main>
          {this.props.children}
        </main>
        <Footer />
      </div>

    );
  }
});

export default MainLayout;
