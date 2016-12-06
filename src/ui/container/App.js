import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Header from '../components/header';
import Files from '../components/files';
import Results from '../components/results';
import Progress from '../components/progress';
import Footer from '../components/footer';

import {
    getOptions,
    getFiles,
    renameFile,
    changeFileType,
    uploadFiles,
    deleteFiles,
    editAnalysis,
    startAnalysis,
    updateResults
} from '../actions';

class App extends Component {
    constructor(props) {
        super(props);
        this.renameFile = this.renameFile.bind(this);
        this.changeFileType = this.changeFileType.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.deleteFiles = this.deleteFiles.bind(this);
        this.editAnalysis = this.editAnalysis.bind(this);
        this.startAnalysis = this.startAnalysis.bind(this);
        this.updateResults = this.updateResults.bind(this);
    }

    componentWillMount() {
        const { dispatch } = this.props;

        dispatch(getFiles());
        dispatch(getOptions());
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
                                renameFile = { this.renameFile }
                                uploadFiles = { this.uploadFiles }
                                deleteFiles = { this.deleteFiles }
                                startAnalysis = { this.startAnalysis }
                            />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col xs={ 12 }>
                            <Results results={ files.results } update={ this.updateResults } />
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
    options: PropTypes.object.isRequired,
    progress: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    const { files, options, progress } = state;
    return {
        files,
        timestamp: files.timestamp,
        options,
        progress
    };
}

export default connect(mapStateToProps)(App);
