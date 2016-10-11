import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import isUndefined from 'lodash/isUndefined';
import AnalysisList from '../components/analysis_list';
import Files from '../components/files';
import AnalysisConfiguration from '../components/analysis_configuration';

import {
    getOptions,
    getFiles,
    uploadFiles,
    deleteFiles,
    selectFiles,
    addAnalysis,
    deleteAnalysis,
    selectAnalysis,
    editAnalysis,
    startAnalysis
} from '../actions';

function renderConfiguration(config, options, files, edit, start) {
    if(isUndefined(config)) {
        return null;
    }

    return(<AnalysisConfiguration config={ config } options= {options } files={ files } editAnalysis={ edit } startAnalysis={ start } />);
}

class App extends Component {
    constructor(props) {
        super(props);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.deleteFiles = this.deleteFiles.bind(this);
        this.selectFiles = this.selectFiles.bind(this);
        this.addAnalysis = this.addAnalysis.bind(this);
        this.deleteAnalysis = this.deleteAnalysis.bind(this);
        this.selectAnalysis = this.selectAnalysis.bind(this);
        this.editAnalysis = this.editAnalysis.bind(this);
        this.startAnalysis = this.startAnalysis.bind(this);
    }

    componentWillMount() {
        const { dispatch } = this.props;

        dispatch(getFiles());
        dispatch(getOptions());
    }

    uploadFiles(event) {
        const { files } = event.target;
        const { dispatch } = this.props;
        dispatch(uploadFiles(files));
    }

    deleteFiles() {
        const { dispatch, filesList, selectedFiles } = this.props;
        const list = selectedFiles.map((index) => filesList[index]);

        dispatch(deleteFiles(list));
    }

    selectFiles(selection) {
        const { dispatch } = this.props;

        dispatch(selectFiles(selection));
    }

    addAnalysis() {
        const { dispatch, options } = this.props;

        dispatch(addAnalysis(options));
    }

    deleteAnalysis(event, index) {
        const { dispatch } = this.props;
        event.stopPropagation();

        dispatch(deleteAnalysis(index));
    }

    selectAnalysis(index) {
        const { dispatch } = this.props;

        dispatch(selectAnalysis(index));
    }

    editAnalysis(config) {
        const { dispatch, selectedAnalysis } = this.props;

        dispatch(editAnalysis(config, selectedAnalysis));
    }

    startAnalysis(config) {
        const { dispatch, selectedAnalysis } = this.props;

        dispatch(startAnalysis(config, selectedAnalysis));
    }

    render() {
        const { filesList, selectedFiles, analysisList, selectedAnalysis, options } = this.props;
        const currentAnalysis = analysisList[selectedAnalysis];

        return (
            <Grid>
                <Row>
                    <Col xs={ 12 } >
                        <Files
                            files={ filesList }
                            selectedFiles = { selectedFiles }
                            uploadFiles = { this.uploadFiles }
                            deleteFiles = { this.deleteFiles }
                            selectFiles = { this.selectFiles }
                        />
                    </Col>
                    <Col xs={ 12 } md={ 4 } >
                        <AnalysisList
                            analysis={ analysisList }
                            selected={ selectedAnalysis }
                            onSelect={ this.selectAnalysis }
                            onDelete={ this.deleteAnalysis }
                            addAnalysis={ this.addAnalysis }
                        />

                    </Col>
                </Row>
                <br />
                <Row>
                    <Col xs={ 12 } >
                        { renderConfiguration(currentAnalysis, options, filesList, this.editAnalysis, this.startAnalysis) }
                    </Col>
                </Row>
            </Grid>
        );
    }
}

App.propTypes = {
    dispatch: PropTypes.func.isRequired,
    filesList: PropTypes.array.isRequired,
    selectedFiles: PropTypes.array.isRequired,
    analysisList: PropTypes.array.isRequired,
    selectedAnalysis: PropTypes.number.isRequired,
    options: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    const { files, analysis, options } = state;
    return {
        filesList: files.list,
        selectedFiles: files.selection,
        analysisList: analysis.list,
        selectedAnalysis: analysis.selected,
        options
    };
}

export default connect(mapStateToProps)(App);
