import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Header from '../components/header';
import Files from '../components/files';

import {
    getOptions,
    getFiles,
    renameFile,
    uploadFiles,
    deleteFiles,
    editAnalysis,
    startAnalysis
} from '../actions';

function renderResult(result) {
    if(!result.fileList || result.fileList.length === 0) {
        return null;
    }

    return (
        <a href={ '/files/result/' + result.fileList[0] } target="_blank" >{ result.fileList[0] }</a>
    );
}

class App extends Component {
    constructor(props) {
        super(props);
        this.renameFiles = this.renameFiles.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.deleteFiles = this.deleteFiles.bind(this);
        this.editAnalysis = this.editAnalysis.bind(this);
        this.startAnalysis = this.startAnalysis.bind(this);
    }

    componentWillMount() {
        const { dispatch } = this.props;

        dispatch(getFiles());
        dispatch(getOptions());
    }

    renameFiles(name, index) {
        const { dispatch, filesList } = this.props;

        dispatch(renameFile(filesList, index, name));
    }

    uploadFiles(event) {
        const { files } = event.target;
        const { dispatch } = this.props;
        dispatch(uploadFiles(files));
    }

    deleteFiles() {
        const { dispatch } = this.props;

        dispatch(deleteFiles());
    }

    editAnalysis(config) {
        const { dispatch } = this.props;

        dispatch(editAnalysis(config));
    }

    startAnalysis(selected) {
        const { dispatch, filesList } = this.props;
        const files = filesList.filter((file, index) => selected.includes(index));

        dispatch(startAnalysis({ files }));
    }

    render() {
        const { filesList, result } = this.props;

        return (
            <Grid>
                <Header />
                <Row>
                    <Col xs={ 12 } >
                        <Files
                            files={ filesList }
                            renameFiles = { this.renameFiles }
                            uploadFiles = { this.uploadFiles }
                            deleteFiles = { this.deleteFiles }
                            startAnalysis = { this.startAnalysis }
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        { renderResult(result) }
                    </Col>
                </Row>
            </Grid>
        );
    }
}

App.propTypes = {
    dispatch: PropTypes.func.isRequired,
    filesList: PropTypes.array.isRequired,
    result: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    const { files, result, options } = state;
    return {
        filesList: files.list,
        result,
        options
    };
}

export default connect(mapStateToProps)(App);
