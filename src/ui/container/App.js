import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Header from '../components/header';
import Files from '../components/files';
import Progress from '../components/progress';
import {Card, CardHeader, CardText} from 'material-ui/Card';

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
    } else {
        let resultHTML = [];
        result.fileList.reverse().forEach(function(entry, fileHMTL) {
            resultHTML.push(
                <div><a href={'/files/result/' + entry} target='_blank'>{entry}</a></div>
            );
        });
        console.log(resultHTML);
        return (
            <Card>
                <CardHeader title="Your results"/>
                <CardText>
                    {resultHTML}
                </CardText>       
            </Card>
        );
    }

    const resultHTML = [];
    result.fileList.forEach((entry) => {
        resultHTML.push(
            <div><a href={'/files/result/' + entry} target='_blank'>{entry}</a></div>
        );
    });

    return (
        <Card>
            <CardHeader title="Your results"/>
            <CardText>
                {resultHTML}
            </CardText>
        </Card>
    );
}

class App extends Component {
    constructor(props) {
        super(props);
        this.renameFile = this.renameFile.bind(this);
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

    renameFile(name, index) {
        const { dispatch, files } = this.props;

        dispatch(renameFile(files.list, index, name));
    }

    uploadFiles(event) {
        const { files } = event.target;
        const { dispatch } = this.props;
        dispatch(uploadFiles(files));
    }

    deleteFiles(selected) {
        const { dispatch, files } = this.props;
        const filtered = files.list.filter((file, index) => selected.includes(index));

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

    render() {
        const { files, result, progress } = this.props;

        return (
            <div>
                <Grid>
                    <Header />
                    <Row>
                        <Col xs={ 12 } >
                            <Files
                                files={ files.list }
                                renameFile = { this.renameFile }
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
                { progress.active ? <Progress message={ progress.message } /> : null }
            </div>
        );
    }
}

App.propTypes = {
    dispatch: PropTypes.func.isRequired,
    files: PropTypes.object.isRequired,
    result: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired,
    progress: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    const { files, result, options, progress } = state;
    return {
        files,
        timestamp: files.timestamp,
        result,
        options,
        progress
    };
}

export default connect(mapStateToProps)(App);
