
import React, { Component, PropTypes } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import moment from 'moment';
import ReactGA from 'react-ga';

const styles = {
    tdIcon: {
        paddingLeft: '0px',
        paddingRight: '0px',
        width: '28px'
    },
    icon: {
        paddingLeft: '2px',
        paddingRight: '2px'
    }
};

function renderRows(results, dialog, deleteResult) {

    function showResult(event, url) {
        ReactGA.event({ category: 'User', action: 'Show result' });
        dialog(event, url);
    }

    return results.map((result) => {
        const { timestamp, files } = result;
        const humanReadableTimestamp = moment(Number(timestamp)).format('llll');

        // each directory (timestamp) represents one result. A result consists of several files
        let filePNG = '';
        let filePDF = '';
        let fileR = '';
        for (let i = 0; i < files.length; i++) {
            if(files[i].endsWith('.png')) {
                filePNG = files[i];
            } else if(files[i].endsWith('.pdf')) {
                filePDF = files[i];
            } else if(files[i].endsWith('.R')) {
                fileR = files[i];
            }
        }
        const basename = filePNG.replace(/\.[^/.]+$/, '');

        let pdfIcon = '';
        if(result.files.indexOf(filePDF) > -1) {
            pdfIcon = (
                <IconButton
                    onClick={() => ReactGA.event({ category: 'User', action: 'Download result PDF' }) }
                    href={ `/results/download/${timestamp}/${filePDF}` }
                    style={styles.icon}
                    title="Download PDF"
                >
                    <FontIcon className="material-icons">picture_as_pdf</FontIcon>
                </IconButton>
            );
        }

        let RIcon = '';
        if(result.files.indexOf(fileR) > -1) {
            RIcon = (
                <IconButton
                        onClick={() => ReactGA.event({ category: 'User', action: 'Download R script' })}
                        href={ `/results/download/${timestamp}/${fileR}`}
                        style={styles.icon}
                        title="Download R Script"
                    >
                    <FontIcon className="material-icons">code</FontIcon>
                </IconButton>
            );
        }

        return (
            <TableRow key={timestamp} selectable={false} >
                <TableRowColumn width={170}>
                    { humanReadableTimestamp }
                </TableRowColumn>
                <TableRowColumn>
                    { basename }
                </TableRowColumn>
                <TableRowColumn style={{ textAlign: 'right' }}>
                    {pdfIcon}
                    <IconButton
                        onClick={() => ReactGA.event({ category: 'User', action: 'Download result PNG' }) }
                        href={ `/results/download/${timestamp}/${filePNG}` }
                        style={styles.icon}
                        title="Download PNG"
                    >
                        <FontIcon className="material-icons">image</FontIcon>
                    </IconButton>
                    <IconButton
                        onClick={ (event) => showResult(event, `/results/diff-table/${timestamp}/${filePNG}`) }
                        href="#"
                        style={styles.icon}
                        title="Preview"
                    >
                        <FontIcon className="material-icons">visibility</FontIcon>
                    </IconButton>
                    {RIcon}
                    <IconButton
                        onClick={(event) => deleteResult(event, timestamp)}
                        href="#"
                        style={styles.icon}
                        title="Delete Result"
                    >
                        <FontIcon className="material-icons">delete</FontIcon>
                    </IconButton>
                </TableRowColumn>
            </TableRow>
        );
    }).reverse();
}

class ResultTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { results, dialog, deleteResult } = this.props;

        if (results.length < 1) {
            return null;
        }

        return (
            <Table maxHeight="241px" selectable={false}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow selectable={false}>
                            <TableHeaderColumn width={170}>Date</TableHeaderColumn>
                            <TableHeaderColumn>Filename</TableHeaderColumn>
                            <TableHeaderColumn></TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={ false }>
                        { renderRows(results, dialog, deleteResult) }
                    </TableBody>
            </Table>
        );
    }
}

ResultTable.propTypes = {
    results: PropTypes.array.isRequired,
    dialog: PropTypes.func.isRequired,
    deleteResult: PropTypes.func.isRequired
};

export default ResultTable;
