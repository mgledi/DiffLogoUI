import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';

const styles = {
    dropZone: {
        display: 'flex',
        width: '100%',
        height: '100px',
        border: 'dashed 1px #ccc',
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
                    Drag'n'Drop your files here or click to open file dialog.
                </div>
            </Dropzone>
        );
    }
}

DropZone.propTypes = {
    onDrop: PropTypes.func.isRequired
};

export default DropZone;
