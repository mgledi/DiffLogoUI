import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Card, CardText, CardActions} from 'material-ui/Card';
import {Popover, PopoverAnimationVertical} from 'material-ui/Popover';
import TextField from 'material-ui/TextField';
import DropZone from './dropzone';
import SeqLogoThumbnail from './seq_logo_thumbnail';
import FileTypeSelect from './file_type_select';
import {Row, Col} from 'react-flexbox-grid';
import ReactGA from 'react-ga';

const styles = {
    startButton: {
        float: 'right'
    },
    smallIcon: {
        fontSize: '13px'
    },
    largeIcon: {
        fontSize: '20px'
    },
    renameButton: {
        padding: 0,
        width: '28px',
        height: '28px'
    },
    popover: {
        overflow: 'none',
        padding: '16px'
    },
    msgInfo: {
        fontSize: '16px',
        fontWeight: 'bold'
    },
    msgError: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#D33'
    },
    rowError: {
        border: '2px solid #D33'
    },
    rowValid: {
        border: 'none'
    }
};

function renderMessages(messages) {
    if (messages.length === 0) {
        return null;
    }

    return messages.map((message, index) => {
        return (
            <div key={ `message_${index}` } style={ styles.msgError }>{ message }</div>
        );
    });
}

function renderTable(files, selected, handlePopoverOpen, handleSeqLogoPopoverOpen, handleSwitchOrientation, setSelectedFiles, handleChangeFileType) {
    return (
        <Table height="241px" fixedHeader={ true } multiSelectable={ true } onRowSelection={ setSelectedFiles } >
            <TableHeader adjustForCheckbox={ true } displaySelectAll= { false }>
                <TableRow selectable= {false }>
                    <TableHeaderColumn width="20%">Name in DiffLogo</TableHeaderColumn>
                    <TableHeaderColumn width="20%">Filename</TableHeaderColumn>
                    <TableHeaderColumn>Sequence logo</TableHeaderColumn>
                    <TableHeaderColumn width="10%">File type</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody deselectOnClickaway={ false } >
                { files.map((file, index) => {
                    return (
                        <TableRow
                            key={ index }
                            selected={ selected.includes(index) }
                            style={ file.error !== '' ? styles.rowError : styles.rowValid}>
                            <TableRowColumn width="20%">
                                <IconButton
                                    iconClassName="material-icons"
                                    iconStyle={ styles.smallIcon }
                                    style={ styles.renameButton }
                                    onClick={(event) => handlePopoverOpen(event, index)}
                                >edit</IconButton>
                                { file.name }
                            </TableRowColumn>
                            <TableRowColumn width="20%">{ file.originalname }</TableRowColumn>
                            <TableRowColumn style={{wordWrap: 'break-word', whiteSpace: 'normal'}}>
                                <SeqLogoThumbnail file={ file } index={ index } switchOrientation={ handleSwitchOrientation } openPopup={ handleSeqLogoPopoverOpen } />
                            </TableRowColumn>
                            <TableRowColumn width="120px">
                                <FileTypeSelect index={ index } type={ file.type } changeType={ handleChangeFileType } />
                            </TableRowColumn>
                        </TableRow>
                    );
                })};
            </TableBody>
        </Table>
    );
}

function getSeqLogoPopover(open, anchorEl, seqLogoFile, handleSeqLogoPopoverClose) {
    if(seqLogoFile === '' || seqLogoFile === void 0) {
        return '';
    }

    return (
        <Popover
            animation={PopoverAnimationVertical}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{horizontal: 'right', vertical: 'center'}}
            targetOrigin={{horizontal: 'left', vertical: 'center'}}
            onRequestClose={handleSeqLogoPopoverClose}
            style={ styles.popover }
        >
            <img src={`/results/seq-logo/${seqLogoFile}`} style={{ width: '400px' }} />
        </Popover>
    );
}

function getPopover(open, anchorEl, inputValue, handlePopoverClose) {
    if(inputValue === '' || inputValue === void 0) {
        return '';
    }

    return (
        <Popover
            animation={PopoverAnimationVertical}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{horizontal: 'right', vertical: 'center'}}
            targetOrigin={{horizontal: 'left', vertical: 'center'}}
            onRequestClose={handlePopoverClose}
            style={ styles.popover }
        >
            <TextField
                id="rename-file"
                ref="rename"
                defaultValue={ inputValue }
                floatingLabelText="Name"
                onKeyPress={ (event) => {
                    if(event.key === 'Enter') {
                        handlePopoverClose();
                    }
                }}/>
        </Popover>
    );
}

class Files extends Component {
    state = {
        seqLogoPopoverOpen: false,
        popoverOpen: false,
        anchorEl: null,
        fileIndex: -1,
        selected: []
    }

    constructor(props) {
        super(props);
        this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
        this.handlePopoverClose = this.handlePopoverClose.bind(this);
        this.handleSeqLogoPopoverOpen = this.handleSeqLogoPopoverOpen.bind(this);
        this.handleSeqLogoPopoverClose = this.handleSeqLogoPopoverClose.bind(this);
        this.handleChangeFileType = this.handleChangeFileType.bind(this);
        this.handleSwitchOrientation = this.handleSwitchOrientation.bind(this);
        this.setSelectedFiles = this.setSelectedFiles.bind(this);
        this.startAnalysis = this.startAnalysis.bind(this);
        this.uploadExample = this.uploadExample.bind(this);
        this.deleteFiles = this.deleteFiles.bind(this);
    }

    handleSeqLogoPopoverOpen(event, index) {
        ReactGA.event({ category: 'User', action: 'Open sequence logo'});
        event.stopPropagation();
        this.setState({
            seqLogoPopoverOpen: true,
            anchorEl: event.target,
            fileIndex: index
        });
    }

    handleSeqLogoPopoverClose() {
        ReactGA.event({category: 'User', action: 'Close sequence logo' });
        this.setState({
            seqLogoPopoverOpen: false,
            anchorEl: null,
            fileIndex: -1
        });
    }

    handlePopoverOpen(event, index) {
        ReactGA.event({category: 'User', action: 'Open change name dialog' });
        event.stopPropagation();
        this.setState({
            popoverOpen: true,
            anchorEl: event.target,
            fileIndex: index
        });
    }

    handleSwitchOrientation(event, index) {
        ReactGA.event({category: 'User', action: 'Switch orientation' });
        const { switchOrientation } = this.props;
        event.stopPropagation();
        switchOrientation(index);
    }

    handlePopoverClose() {
        ReactGA.event({category: 'User', action: 'Close change name dialog' });
        const { renameFile } = this.props;
        const { fileIndex } = this.state;

        renameFile(fileIndex, this.refs.rename.input.value);
        this.setState({
            popoverOpen: false,
            anchorEl: null,
            fileIndex: -1
        });
    }

    handleChangeFileType(newType, index) {
        ReactGA.event({category: 'User', action: 'Change file type' });
        const { changeFileType } = this.props;
        // -----------------------------------
        changeFileType(newType, index);
    }

    setSelectedFiles(selected) {
        this.setState({
            selected
        });
    }

    uploadExample() {
        const { uploadExample } = this.props;
        // -----------------------------------
        uploadExample();
    }

    startAnalysis() {
        const { startAnalysis } = this.props;
        const { selected } = this.state;
        // -----------------------------------
        startAnalysis(selected);
    }

    deleteFiles() {
        const { deleteFiles } = this.props;
        const { selected } = this.state;
        // -----------------------------------
        deleteFiles(selected);
        this.setSelectedFiles([]);
    }

    getMessage() {
        const { files } = this.props;
        const text = [];
        // -----------------------------------
        if (files.length < 2) {
            text.push('Upload at least 2 files to start analysis.');
        }

        if (files.filter((file) => file.error !== '').length > 0) {
            text.push('Some files can not be parsed. Only valid files will be processed.');
        }

        return text;
    }

    disableStartButton(selected) {
        const { files } = this.props;

        if (selected.length === 0) {
            return files.filter((file) => file.error === '').length < 2;
        }

        return files.filter((file, index) => file.error !== '' && selected.indexOf(index) > -1).length > 0 ||
               files.filter((file, index) => file.error === '' && selected.indexOf(index) > -1).length < 2;
    }

    render() {
        const { files, uploadFiles } = this.props;
        const { seqLogoPopoverOpen, popoverOpen, anchorEl, fileIndex, selected } = this.state;
        const fileValue = files[fileIndex] ? files[fileIndex].name : 'Untitled';
        const seqLogoFile = files[fileIndex] ? files[fileIndex].seqLogoFile : '';

        return (
            <Card>
                <CardText>
                    { renderMessages(this.getMessage()) }
                    { (files.length === 0) ?
                        <div style={{height: '141px', textAlign: 'center', paddingTop: '100px'}}>
                            <div><FlatButton label="Load and compare CTCF motifs from four cell lines." labelPosition="before" onClick={ this.uploadExample }/></div>
                            <div>or</div>
                            <div><FlatButton label="Download example files." labelPosition="before" href="https://github.com/mgledi/DiffLogoUI/raw/master/example_ctcf/ctcf.zip"/></div>
                        </div>
                        :
                        renderTable(files, selected, this.handlePopoverOpen, this.handleSeqLogoPopoverOpen, this.handleSwitchOrientation, this.setSelectedFiles, this.handleChangeFileType)}
                    { getPopover(popoverOpen, anchorEl, fileValue, this.handlePopoverClose) }
                    { getSeqLogoPopover(seqLogoPopoverOpen, anchorEl, seqLogoFile, this.handleSeqLogoPopoverClose) }
                </CardText>
                <CardActions>
                <Row around="xs" center="xs">
                    <Col xs={2}>
                        <RaisedButton
                            label={ selected.length === 0 && files.length > 0 ? 'Delete all motifs' : 'Delete motifs' }
                            overlayStyle={{ 'overflowX': 'hidden', 'overflowY': 'hidden' }}
                            labelPosition={'before'}
                            secondary={ true }
                            backgroundColor='red'
                            onClick={ this.deleteFiles }
                            fullWidth={true}
                            disabled={ files.length === 0 }/>
                    </Col>
                    <Col xs>
                        <DropZone onDrop={ uploadFiles }/>
                    </Col>
                    <Col xs={2}>
                        <RaisedButton
                            label={selected.length === 0 && files.length > 0 ? 'Compare all motifs' : 'Compare motifs'}
                            overlayStyle={{ 'overflowX': 'hidden', 'overflowY': 'hidden' }}
                            labelPosition={'before'}
                            primary={ true }
                            disabled={ this.disableStartButton(selected) }
                            style={ styles.startButton }
                            fullWidth={true}
                            onClick={ this.startAnalysis }
                        />
                    </Col>
                </Row>
                </CardActions>
            </Card>
        );
    }
}

Files.propTypes = {
    files: PropTypes.array.isRequired,
    uploadFiles: PropTypes.func.isRequired,
    deleteFiles: PropTypes.func.isRequired,
    renameFile: PropTypes.func.isRequired,
    changeFileType: PropTypes.func.isRequired,
    switchOrientation: PropTypes.func.isRequired,
    uploadExample: PropTypes.func.isRequired,
    startAnalysis: PropTypes.func.isRequired
};

export default Files;
