import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';

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
    }
};

function renderTable(files, selectedFiles, onRowSelection) {
    return (
        <Table height="241px" fixedHeader={ true } multiSelectable={ true } onRowSelection={ onRowSelection } >
            <TableHeader enableSelectAll={ false }>
                <TableRow>
                    <TableHeaderColumn>Filename</TableHeaderColumn>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody deselectOnClickaway={ false } >
                { files.map((file, index) => {
                    return (
                        <TableRow key={ index } selected={ selectedFiles.includes(index) } >
                            <TableRowColumn>{ file.name }</TableRowColumn>
                            <TableRowColumn></TableRowColumn>
                        </TableRow>
                    );
                })};
            </TableBody>
        </Table>
    );
}

class Files extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: true
        };
        this.handleExpandChange = this.handleExpandChange.bind(this);
    }

    handleExpandChange(expanded) {
        this.setState({ expanded: expanded });
    }

    render() {
        const { files, selectFiles, selectedFiles, uploadFiles, deleteFiles } = this.props;
        return (
            <Card expanded={ this.state.expanded } onExpandChange={ this.handleExpandChange } >
                <CardHeader title="Files" subtitle="Upload files to analyse" actAsExpander={ true } showExpandableButton= { true } />
                <CardText expandable={ true } >
                    { renderTable(files, selectedFiles, selectFiles) }
                </CardText>
                <CardActions>
                    <FlatButton label="Delete Files" labelPosition="before" onClick={ deleteFiles } disabled={ selectedFiles.length === 0 }/>
                    <FlatButton primary={ true } label="Add Files" labelPosition="before">
                        <input type="file" multiple onChange={ uploadFiles } style={styles.filesInput}/>
                    </FlatButton>
                </CardActions>
            </Card>
        );
    }
}

Files.propTypes = {
    files: PropTypes.array.isRequired,
    selectedFiles: PropTypes.array.isRequired,
    uploadFiles: PropTypes.func.isRequired,
    deleteFiles: PropTypes.func.isRequired,
    selectFiles: PropTypes.func.isRequired
};

export default Files;
