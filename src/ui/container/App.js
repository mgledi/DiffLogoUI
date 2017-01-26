import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Header from '../components/header';
import Files from '../components/files';
import Results from '../components/results';
import Progress from '../components/progress';
import Footer from '../components/footer';

import {
    getFiles,
    renameFile,
    changeFileType,
    switchOrientation,
    uploadFiles,
    deleteFiles,
    deleteResult,
    editAnalysis,
    startAnalysis,
    copyExampleFilesToSession,
    updateResults
} from '../actions';

class App extends Component {
    constructor(props) {
        super(props);
        this.renameFile = this.renameFile.bind(this);
        this.changeFileType = this.changeFileType.bind(this);
        this.switchOrientation = this.switchOrientation.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.deleteFiles = this.deleteFiles.bind(this);
        this.deleteResult = this.deleteResult.bind(this);
        this.editAnalysis = this.editAnalysis.bind(this);
        this.startAnalysis = this.startAnalysis.bind(this);
        this.uploadExample = this.uploadExample.bind(this);
        this.updateResults = this.updateResults.bind(this);
    }

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(getFiles());
    }

    renameFile(name, index) {
        const { dispatch, files } = this.props;
        dispatch(renameFile(files.list, index, name));
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
        const { files, progress } = this.props;
        return (
            <div>
                <Grid>
                    <Header />
                    <br />
                    <Row>
                        <Col xs={ 12 } >
                            <Files
                                files={ files.list }
                                changeFileType = { this.changeFileType }
                                switchOrientation = { this.switchOrientation }
                                renameFile = { this.renameFile }
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
                    <br />
                    <Footer />
                </Grid>
                { progress.active ? <Progress message={ progress.message } /> : null }
            </div>
        );
    }
}

App.propTypes = {
    dispatch: PropTypes.func.isRequired,
    files: PropTypes.object.isRequired,
    progress: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    const { files, progress } = state;
    return {
        files,
        timestamp: files.timestamp,
        progress
    };
}

export default connect(mapStateToProps)(App);
