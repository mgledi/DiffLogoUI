import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';

class SampleSizeInput extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { file, index, setSampleSize } = this.props;

        return (
                <TextField
                onClick={(event) => event.stopPropagation()}
                id="sampleSize"
                ref="sampleSize"
                defaultValue={ file.sampleSize }
                onChange={(event, newValue) => setSampleSize(newValue, index)}
                />
        );
    }
}

SampleSizeInput.propTypes = {
    'file': PropTypes.object.isRequired,
    'index': PropTypes.number.isRequired,
    'setSampleSize': PropTypes.func.isRequired
};

export default SampleSizeInput;
