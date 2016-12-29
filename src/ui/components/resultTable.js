
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

function renderRows(results, dialog) {

    function showResult(event, url) {
        ReactGA.event({ category: 'User', action: 'Show result' });
        dialog(event, url);
    }

    return results.map((result) => {
        const { timestamp, files } = result;
        const humanReadableTimestamp = moment(Number(timestamp)).format('llll');

        // each directory (timestamp) represents one result. A result consists of several files
        const basename = files[0].replace(/\.[^/.]+$/, '');
        const filePNG = basename + '.png';
        const filePDF = basename + '.pdf';
        const fileTXT = basename + '.txt'; // TODO: add functionality for txt output

        let pdfIcon = '';
        if(result.files.indexOf(filePDF) > -1) {
            pdfIcon = (
                <IconButton
                    onClick={() => ReactGA.event({ category: 'User', action: 'Download result PDF' }) }
                    href={ `/results/diff-table/${timestamp}/${filePDF}` }
                    target='_blank'
                    style={styles.icon}
                >
                    <FontIcon className="material-icons">picture_as_pdf</FontIcon>
                </IconButton>
            );
        }

        return (
            <TableRow key={timestamp} selectable={false} >
                <TableRowColumn width={170}>
                    { humanReadableTimestamp }
                </TableRowColumn>
                <TableRowColumn style={styles.tdIcon}>{pdfIcon}</TableRowColumn>
                <TableRowColumn style={styles.tdIcon}>
                    <IconButton
                        onClick={() => ReactGA.event({ category: 'User', action: 'Download result PNG' }) }
                        href={ `/results/diff-table/${timestamp}/${filePNG}` }
                        target='_blank'
                        style={styles.icon}
                    >
                        <FontIcon className="material-icons">image</FontIcon>
                    </IconButton>
                </TableRowColumn>
                <TableRowColumn style={styles.tdIcon}>
                    <IconButton
                        onClick={ (event) => showResult(event, `/results/diff-table/${timestamp}/${filePNG}`) }
                        href="#"
                        style={styles.icon}
                    >
                        <FontIcon className="material-icons">visibility</FontIcon>
                    </IconButton>
                </TableRowColumn>
                 <TableRowColumn>
                    { basename }
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
        const { results, dialog } = this.props;

        if (results.length < 1) {
            return null;
        }

        return (
            <Table maxHeight="241px" selectable={false}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow selectable={false}>
                            <TableHeaderColumn width={170}>Date</TableHeaderColumn>
                            <TableHeaderColumn style={styles.tdIcon}></TableHeaderColumn>
                            <TableHeaderColumn style={styles.tdIcon}></TableHeaderColumn>
                            <TableHeaderColumn style={styles.tdIcon}></TableHeaderColumn>
                            <TableHeaderColumn>Filename</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={ false }>
                        { renderRows(results, dialog) }
                    </TableBody>
            </Table>
        );
    }
}

ResultTable.propTypes = {
    results: PropTypes.array.isRequired,
    dialog: PropTypes.func.isRequired
};

export default ResultTable;
