import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import {Popover, PopoverAnimationVertical} from 'material-ui/Popover';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

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
    }
};

function renderTable(files, selected, handlePopoverOpen, setSelectedFiles) {
    return (
        <Table height="241px" fixedHeader={ true } multiSelectable={ true } onRowSelection={ setSelectedFiles } >
            <TableHeader adjustForCheckbox={ true } displaySelectAll= {false }>
                <TableRow selectable= {false }>
                    <TableHeaderColumn>Filename</TableHeaderColumn>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    <TableHeaderColumn>Type</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody deselectOnClickaway={ false } >
                { files.map((file, index) => {
                    return (
                        <TableRow key={ index } selected={ selected.includes(index) } selectable={ file.type !== 'unknown' }>
                            <TableRowColumn>{ file.originalname }</TableRowColumn>
                            <TableRowColumn>
                                <IconButton
                                    iconClassName="material-icons"
                                    iconStyle={ styles.smallIcon }
                                    style={ styles.renameButton }
                                    onClick={(event) => handlePopoverOpen(event, index)}
                                >edit</IconButton>
                                { file.name }
                            </TableRowColumn>
                            <TableRowColumn>
                            { file.type }
                            </TableRowColumn>
                        </TableRow>
                    );
                })};
            </TableBody>
        </Table>
    );
}

function getPopover(open, anchorEl, inputValue, handlePopoverClose, handleInputChange) {
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
            <TextField id="rename-file" value={ inputValue } onChange={ handleInputChange } floatingLabelText="Name" />
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
        this.handleNameChange = this.handleNameChange.bind(this);
        this.setSelectedFiles = this.setSelectedFiles.bind(this);
        this.startAnalysis = this.startAnalysis.bind(this);
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
        this.setState({
            popoverOpen: false,
            anchorEl: null,
            fileIndex: -1
        });
    }

    handleNameChange(event, value) {
        const { renameFiles } = this.props;
        const { fileIndex } = this.state;

        renameFiles(fileIndex, value);
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

    render() {
        const { files, uploadFiles, deleteFiles } = this.props;
        const { popoverOpen, anchorEl, fileIndex, selected } = this.state;
        const fileValue = files[fileIndex] ? files[fileIndex].name : 'Untitled';

        return (
            <Card>
                <CardHeader title="Files" subtitle="Upload files to analyse" />
                <CardText>
                    { renderTable(files, selected, this.handlePopoverOpen, this.setSelectedFiles) }
                    { getPopover(popoverOpen, anchorEl, fileValue, this.handlePopoverClose, this.handleNameChange) }
                </CardText>
                <CardActions>
                    <FlatButton label="Delete Files" labelPosition="before" onClick={ deleteFiles } disabled={ files.length === 0 }/>
                    <FlatButton label="Add Files" labelPosition="before">
                        <input type="file" multiple onChange={ uploadFiles } style={styles.filesInput}/>
                    </FlatButton>
                    <RaisedButton label="Start" primary={ true } disabled={ files.length === 0 } style={ styles.startButton } onClick={ this.startAnalysis } />
                </CardActions>
            </Card>
        );
    }
}

Files.propTypes = {
    files: PropTypes.array.isRequired,
    uploadFiles: PropTypes.func.isRequired,
    deleteFiles: PropTypes.func.isRequired,
    renameFiles: PropTypes.func.isRequired,
    startAnalysis: PropTypes.func.isRequired
};

export default Files;
