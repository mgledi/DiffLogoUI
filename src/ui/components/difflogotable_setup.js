import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import fetch from 'isomorphic-fetch';

export default class coreSetup extends Component {
    constructor(props) {
        super(props);
        this.startProcess = this.startProcess.bind(this);
    }

    uploadFiles() {
        const formData = new FormData();
        const length = fileList.length;

        for (let i = 0; i < length; i++) {
            let file = fileList[i];
            formData.append('files', file, file.name);
        }
        fetch('/files/upload', {
            credentials: 'same-origin',
            method: 'POST',
            body: formData
        })
        .then((response) => {
            console.log(response);
        });
    }

    startProcess() {
        fetch('/process/start', {
            credentials: 'same-origin',
            method: 'PUT'
        })
        .then((response) => {
            console.log(response);
        });
    }

    render() {
        return (
            <div style={{ padding: '10px' }}>
                <FlatButton onClick={ this.startProcess } label="Start" labelPosition="before" />
            </div>
        );
    }
};
