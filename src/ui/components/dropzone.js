import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';

const styles = {
    dropZone: {
        display: 'flex',
        width: '100%',
        height: '50px',
        border: '2px dashed #666',
        color: '#666',
        justifyContent: 'space-around'
    },
    helpText: {
        alignSelf: 'center'
    }
};

class DropZone extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { onDrop } = this.props;

        return (
            <Dropzone onDrop={onDrop} style={ styles.dropZone } >
                <div style={ styles.helpText }>
                    Drop your motif files here, or click to select files for upload.
                </div>
            </Dropzone>
        );
    }
}

DropZone.propTypes = {
    onDrop: PropTypes.func.isRequired
};

export default DropZone;
