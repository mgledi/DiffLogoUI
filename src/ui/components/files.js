import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Card, CardText, CardActions} from 'material-ui/Card';
import {Popover, PopoverAnimationVertical} from 'material-ui/Popover';
import TextField from 'material-ui/TextField';

const styles = {
    filesInput: {
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        width: '100%',
        opacity: 0
    },
    startButton: {
        float: 'right'
    },
    smallIcon: {
        fontSize: '13px'
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
    textError: {
        color: '#D33'
    },
    rowValid: {
        border: 'none'
    }

};

function renderSeqLogoThumbnailOrError(file, index) {
    if (file.seqLogoFile !== '') {
        return (
            <img key={ `seqLogoThumbnail_${index}`} width='120' src={`files/seqLogo/${file.seqLogoFile}`}/>
        );
    } else if ( file.error !== '') {
        return (
            <span style={styles.textError} >Can not parse file: {file.error}</span>
        );      
    } else {
        return (
            '...'
        )
    }
    
}

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

function renderTable(files, selected, handlePopoverOpen, setSelectedFiles) {
    return (
        <Table height="241px" fixedHeader={ true } multiSelectable={ true } onRowSelection={ setSelectedFiles } >
            <TableHeader adjustForCheckbox={ true } displaySelectAll= { false }>
                <TableRow selectable= {false }>
                    <TableHeaderColumn width="150px">Name in DiffLogo</TableHeaderColumn>
                    <TableHeaderColumn width="150px">Filename</TableHeaderColumn>
                    <TableHeaderColumn>Sequence logo</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody deselectOnClickaway={ false } >
                { files.map((file, index) => {
                    return (
                        <TableRow
                            key={ index }
                            selected={ selected.includes(index) }
                            selectable={ file.type !== 'unknown' }
                            style={ file.error !== '' ? styles.rowError : styles.rowValid}>
                            <TableRowColumn width="150px">
                                <IconButton
                                    iconClassName="material-icons"
                                    iconStyle={ styles.smallIcon }
                                    style={ styles.renameButton }
                                    onClick={(event) => handlePopoverOpen(event, index)}
                                >edit</IconButton>
                                { file.name }
                            </TableRowColumn>
                            <TableRowColumn width="150px">{ file.originalname }</TableRowColumn>
                            <TableRowColumn style={{wordWrap: 'break-word', whiteSpace: 'normal'}}>{ renderSeqLogoThumbnailOrError(file, index) } </TableRowColumn>
                        </TableRow>
                    );
                })};
            </TableBody>
        </Table>
    );
}

function getPopover(open, anchorEl, inputValue, handlePopoverClose) {
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
        popoverOpen: false,
        anchorEl: null,
        fileIndex: -1,
        selected: []
    }

    constructor(props) {
        super(props);
        this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
        this.handlePopoverClose = this.handlePopoverClose.bind(this);
        this.setSelectedFiles = this.setSelectedFiles.bind(this);
        this.startAnalysis = this.startAnalysis.bind(this);
        this.deleteFiles = this.deleteFiles.bind(this);
    }

    handlePopoverOpen(event, index) {
        event.stopPropagation();
        this.setState({
            popoverOpen: true,
            anchorEl: event.target,
            fileIndex: index
        });
    }

    handlePopoverClose() {
        const { renameFile } = this.props;
        const { fileIndex } = this.state;

        renameFile(fileIndex, this.refs.rename.input.value);
        this.setState({
            popoverOpen: false,
            anchorEl: null,
            fileIndex: -1
        });
    }

    setSelectedFiles(selected) {
        this.setState({
            selected
        });
    }

    startAnalysis() {
        const { startAnalysis } = this.props;
        const { selected } = this.state;

        startAnalysis(selected);
    }

    deleteFiles() {
        const { deleteFiles } = this.props;
        const { selected } = this.state;

        deleteFiles(selected);
        this.setSelectedFiles([]);
    }

    getMessage() {
        const { files } = this.props;
        const text = [];

        if (files.length < 2) {
            text.push('Upload at least 2 files to start analysis.');
        }

        if (this.filesContainErrors()) {
            text.push('Some files can not be parsed. Solve errors first.');
        }

        return text;
    }

    filesContainErrors() {
        const { files } = this.props;

        return files.filter((file) => file.error !== '').length > 0;
    }

    render() {
        const { files, uploadFiles } = this.props;
        const { popoverOpen, anchorEl, fileIndex, selected } = this.state;
        const fileValue = files[fileIndex] ? files[fileIndex].name : 'Untitled';

        return (
            <Card>
                <CardText>
                    { renderMessages(this.getMessage()) }
                    { renderTable(files, selected, this.handlePopoverOpen, this.setSelectedFiles) }
                    { getPopover(popoverOpen, anchorEl, fileValue, this.handlePopoverClose) }
                </CardText>
                <CardActions>
                    <FlatButton label="Delete Files" labelPosition="before" onClick={ this.deleteFiles } disabled={ files.length === 0 }/>
                    <FlatButton label="Add Files" labelPosition="before">
                        <input type="file" multiple onChange={ uploadFiles } style={styles.filesInput}/>
                    </FlatButton>
                    <RaisedButton
                        label="Start"
                        primary={ true }
                        disabled={ files.length < 2 }
                        style={ styles.startButton }
                        onClick={ this.startAnalysis }
                    />
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
    startAnalysis: PropTypes.func.isRequired
};

export default Files;
