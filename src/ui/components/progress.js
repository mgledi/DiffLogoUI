import React, { Component, PropTypes } from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import CircularProgress from 'material-ui/CircularProgress';
import Overlay from 'material-ui/internal/Overlay';
import Paper from 'material-ui/Paper';

const styles = {
    overlay: {
        zIndex: 1400
    },
    progress: {
        position: 'fixed',
        boxSizing: 'border-box',
        zIndex: 1500,
        top: '40%',
        left: '0px',
        width: '100%',
        height: '100%'
    },
    paper: {
        minHeight: 200,
        textAlign: 'center',
        padding: 20
    }
};

class Progress extends Component {
    render() {
        const { message } = this.props;

        return (
            <div>
                <div style={ styles.progress } >
                    <Grid>
                        <Row>
                            <Col xs={6} xsOffset={3}>
                                <Paper style={ styles.paper }>
                                    <h3>Progress</h3>
                                    <CircularProgress size={60} thickness={7} />
                                    <p>{ message }</p>
                                </Paper>
                            </Col>
                        </Row>
                    </Grid>
                </div>
                <Overlay show={true} style={ styles.overlay } />
            </div>
        );
    }
}

Progress.propTypes = {
    message: PropTypes.string.isRequired
};

export default Progress;
