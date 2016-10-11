import React, { Component, PropTypes } from 'react';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import {Row, Col} from 'react-flexbox-grid';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

const MODES = ['CTCF'];
const METHODS = ['pairDiff', 'tableDiff'];

function renderLeftFileForPairDiff(config, files, changePairDiffFile) {
    return (
        <Col xs={6} >
            <SelectField value={ config.files && config.files[0] } floatingLabelText="Motif 1" onChange={ (event, key, value) => changePairDiffFile(0, value) } fullWidth={ true } >
                {
                    files.map((file, index) => {
                        return (
                            <MenuItem key={index} value={ file.name } primaryText={ file.name } disabled={ config.files && config.files[1] === file.name } />
                        );
                    })
                }
            </SelectField>
        </Col>
    );
}

function renderRightFileForPairDiff(config, files, changePairDiffFile) {
    return (
        <Col xs={6} >
            <SelectField value={ config.files && config.files[1] } floatingLabelText="Motif 2" onChange={ (event, key, value) => changePairDiffFile(1, value) } fullWidth={ true } >
                {
                    files.map((file, index) => {
                        return (
                            <MenuItem key={index} value={ file.name } primaryText={ file.name } disabled={ config.files && config.files[0] === file.name } />
                        );
                    })
                }
            </SelectField>
        </Col>
    );
}

function renderFileSelection(config, files, changePairDiffFile) {
    if (files.length === 0) {
        return (<p>No files found. Please upload some files to analyse</p>);
    }

    if (config.method === 'pairDiff') {
        return (
            <Row>
                { renderLeftFileForPairDiff(config, files, changePairDiffFile) }
                { renderRightFileForPairDiff(config, files, changePairDiffFile) }
            </Row>
        );
    }

    return null;
}

function renderStackHeight(config, options, changeStackHeight) {
    return (
        <Col xs={6}>
            <SelectField value={ config.stackHeight } floatingLabelText="Stack Height" onChange={ changeStackHeight } fullWidth={ true } >
            {
                options.stackHeight.map((option, index) => {
                    return (
                        <MenuItem key={ index } value={ option.value } primaryText={ option.title } />
                    );
                })
            }
            </SelectField>
        </Col>
    );
}

function renderBaseDistribution(config, options, changeBaseDistribution) {
    return (
        <Col xs={6}>
            <SelectField value={ config.baseDistribution } floatingLabelText="Base Distribution" onChange={ changeBaseDistribution } fullWidth={ true } >
            {
                options.baseDistribution.map((option, index) => {
                    return (
                        <MenuItem key={ index } value={ option.value } primaryText={ option.title } />
                    );
                })
            }
            </SelectField>
        </Col>
    );
}

function renderStartButton(config, startAnalysis) {
    const { method, files, mode } = config;
    const hasMethod = method && method !== '';
    const hasFiles = files && files.length === 2;
    const hasMode = mode && mode !== '';
    const enabled = hasMode && hasMethod && hasFiles;

    return(
        <FlatButton disabled={ !enabled } label="Start Analysis" primary={ true } onClick={ startAnalysis }/>
    );
}

function renderDownloadButton(config) {
    const { fileList } = config;

    if (!fileList || fileList.length === 0) {
        return null;
    }

    return(
        <a href={ 'files/result/' + fileList[0]} target="_blank" >{ fileList[0] }</a>
    );
}

class AnalysisConfiguration extends Component {
    constructor(props) {
        super(props);
        this.textFieldChange = this.textFieldChange.bind(this);
        this.modeChange = this.modeChange.bind(this);
        this.changeMethod = this.changeMethod.bind(this);
        this.changePairDiffFile = this.changePairDiffFile.bind(this);
        this.changeStackHeight = this.changeStackHeight.bind(this);
        this.changeBaseDistribution = this.changeBaseDistribution.bind(this);
        this.startAnalysis = this.startAnalysis.bind(this);
    }

    textFieldChange(event) {
        const { name, value } = event.target;
        const { config, editAnalysis } = this.props;

        config[name] = value;
        editAnalysis(config);
    }

    modeChange(event, index) {
        const { config, editAnalysis } = this.props;

        config.mode = MODES[index];
        editAnalysis(config);
    }

    changeMethod(event, index) {
        const { config, editAnalysis } = this.props;

        config.method = METHODS[index];
        editAnalysis(config);
    }

    changePairDiffFile(index, file) {
        const { config, editAnalysis } = this.props;

        config.files = config.files || [];
        config.files[index] = file;

        editAnalysis(config);
    }

    changeStackHeight(event, key, value) {
        const { config, editAnalysis } = this.props;

        config.stackHeight = value;
        editAnalysis(config);
    }

    changeBaseDistribution(event, key, value) {
        const { config, editAnalysis } = this.props;

        config.baseDistribution = value;
        editAnalysis(config);
    }

    startAnalysis() {
        const { config, startAnalysis } = this.props;

        startAnalysis(config);
    }

    render() {
        const { config, files, options } = this.props;

        return (
            <Card>
                <CardHeader title={ config.name } />
                <CardText>
                    <Row>
                        <Col xs={4}>
                            <TextField name="name" value={ config.name } floatingLabelText="Name" onChange={ this.textFieldChange } fullWidth={ true } />
                        </Col>
                        <Col xs={4}>
                            <SelectField id="mode" value={ config.mode } floatingLabelText="Mode" onChange={ this.modeChange } fullWidth={ true } >
                                <MenuItem key={0} value="CTCF" primaryText="CTCF" />
                            </SelectField>
                        </Col>
                        <Col xs={4}>
                            <SelectField id="method" value={ config.method } floatingLabelText="Method" onChange={ this.changeMethod } fullWidth={ true }>
                                <MenuItem key={0} value="pairDiff" primaryText="Pair Diff" />
                                <MenuItem key={1} value="tableDiff" primaryText="Table Diff" />
                            </SelectField>
                        </Col>
                    </Row>
                    { renderFileSelection(config, files, this.changePairDiffFile) }
                    <Row>
                        { renderStackHeight(config, options, this.changeStackHeight) }
                        { renderBaseDistribution(config, options, this.changeBaseDistribution) }
                    </Row>
                </CardText>
                <CardActions>
                    { renderStartButton(config, this.startAnalysis) }
                    { renderDownloadButton(config) }
                </CardActions>
            </Card>
        );
    }
}

AnalysisConfiguration.propTypes = {
    config: PropTypes.object.isRequired,
    editAnalysis: PropTypes.func.isRequired,
    startAnalysis: PropTypes.func.isRequired,
    files: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired
};

export default AnalysisConfiguration;
