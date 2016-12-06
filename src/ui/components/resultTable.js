import React, { Component, PropTypes } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import moment from 'moment';
import ReactGA from 'react-ga';

function renderRows(results, dialog) {

    function showResult(event, url) {
        ReactGA.event({ category: 'User', action: 'Show result' });
        dialog(event, url);
    }

    return results.map((result) => {
        const { timestamp, files } = result;
        const humanReadableTimestamp = moment(Number(timestamp)).format('llll');

        return files.map((file) => {
            return (
                <TableRow key={timestamp} selectable={false} >
                    <TableRowColumn>
                        { humanReadableTimestamp }
                    </TableRowColumn>
                    <TableRowColumn>
                        { file }
                        <IconButton
                            onClick={() => ReactGA.event({ category: 'User', action: 'Download result' }) }
                            href={ `/files/result/${timestamp}/${file}` }
                            target='_blank'
                        >
                            <FontIcon className="material-icons">file_download</FontIcon>
                        </IconButton>
                        <IconButton
                            onClick={ (event) => showResult(event, `/files/result/${timestamp}/${file}`) }
                            href="#"
                        >
                            <FontIcon className="material-icons">visibility</FontIcon>
                        </IconButton>
                    </TableRowColumn>
                    <TableRowColumn>n.a.</TableRowColumn>
                    <TableRowColumn>n.a.</TableRowColumn>
                </TableRow>
            );
        });
    });
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
                            <TableHeaderColumn>Date</TableHeaderColumn>
                            <TableHeaderColumn>Filename</TableHeaderColumn>
                            <TableHeaderColumn>R Script</TableHeaderColumn>
                            <TableHeaderColumn>Logs</TableHeaderColumn>
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
