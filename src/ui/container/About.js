import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class About extends Component {
    render() {
        return (
            <h1>About</h1>
        );
    }
}

export default connect()(About);
