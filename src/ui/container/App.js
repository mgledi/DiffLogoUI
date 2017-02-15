import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Grid} from 'react-flexbox-grid';

import Header from '../components/header';
import Progress from '../components/progress';
import Footer from '../components/footer';

class App extends Component {

    render() {
        const { children, progress } = this.props;

        return (
            <MuiThemeProvider>
                <div>
                    <Grid>
                        <Header />
                        <br />
                        { children }
                        <br />
                        <Footer />
                    </Grid>
                    { progress.active ? <Progress message={ progress.message } /> : null }
                </div>
            </MuiThemeProvider>
        );
    }
}

App.propTypes = {
    children: PropTypes.element,
    progress: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    const { progress } = state;
    return {
        progress
    };
}

export default connect(mapStateToProps)(App);
