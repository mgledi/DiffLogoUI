import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {Row, Col} from 'react-flexbox-grid';
import bindAll from 'lodash/bindAll';
import Files from '../components/files';
import Results from '../components/results';

import {
    getFiles,
    renameFile,
    changeFileType,
    setSampleSize,
    switchOrientation,
    uploadFiles,
    deleteFiles,
    deleteResult,
    editAnalysis,
    startAnalysis,
    copyExampleFilesToSession,
    updateResults
} from '../actions';

class Home extends Component {
    constructor(props) {
        super(props);
        bindAll(this,
            [
                'renameFile',
                'changeFileType',
                'switchOrientation',
                'setSampleSize',
                'uploadFiles',
                'deleteFiles',
                'deleteResult',
                'editAnalysis',
                'startAnalysis',
                'uploadFiles',
                'uploadExample',
                'updateResults'
            ]);
    }

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(getFiles());
    }

    renameFile(name, index) {
        const { dispatch, files } = this.props;
        dispatch(renameFile(files.list, index, name));
    }

    setSampleSize(sampleSize, index) {
        const { dispatch, files } = this.props;
        dispatch(setSampleSize(files.list, sampleSize, index));
    }

    changeFileType(newType, index) {
        const { dispatch, files } = this.props;
        dispatch(changeFileType(files.list, newType, index));
    }

    uploadFiles(files) {
        const { dispatch } = this.props;
        dispatch(uploadFiles(files));
    }

    deleteFiles(selected) {
        const { dispatch, files } = this.props;
        let filtered = files.list.filter((file, index) => selected.includes(index));

        if (filtered.length === 0) {
            filtered = [].concat(files.list);
        }

        dispatch(deleteFiles({ files: filtered }));
    }

    switchOrientation(index) {
        const { dispatch, files } = this.props;
        dispatch(switchOrientation(files.list, index));
    }

    deleteResult(timestamp) {
        const { dispatch } = this.props;
        dispatch(deleteResult(timestamp));
    }

    editAnalysis(config) {
        const { dispatch } = this.props;
        dispatch(editAnalysis(config));
    }

    startAnalysis(selected) {
        const { dispatch, files } = this.props;
        let filtered = files.list.filter((file, index) => selected.includes(index));

        if (filtered.length === 0) {
            filtered = files.list.filter((file) => file.error === '');
        }

        dispatch(startAnalysis({ files: filtered }));
    }

    uploadExample() {
        const { dispatch } = this.props;
        dispatch(copyExampleFilesToSession());
    }

    updateResults(results) {
        const { dispatch } = this.props;
        dispatch(updateResults(results));
    }

    render() {
        const { files } = this.props;

        return (
            <div>
                <Row>
                    <Col xs={ 12 } >
                        <Files
                            files={ files.list }
                            changeFileType = { this.changeFileType }
                            switchOrientation = { this.switchOrientation }
                            renameFile = { this.renameFile }
                            setSampleSize = { this.setSampleSize }
                            uploadFiles = { this.uploadFiles }
                            deleteFiles = { this.deleteFiles }
                            startAnalysis = { this.startAnalysis }
                            uploadExample = { this.uploadExample }
                        />
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col xs={ 12 }>
                        <Results results={ files.results } update={ this.updateResults } deleteResult={ this.deleteResult }/>
                    </Col>
                </Row>
            </div>
        );
    }
}

Home.propTypes = {
    dispatch: PropTypes.func.isRequired,
    files: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    const { files } = state;
    return {
        files,
        timestamp: files.timestamp
    };
}

export default connect(mapStateToProps)(Home);
