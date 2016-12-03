import React, { Component, PropTypes } from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

class ResultTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { files } = this.props;

        if (files.length === 0) {
            return null;
        }

        return (
            <Card>
                <CardHeader title="Your results"/>
                <CardText>
                    <Table maxHeight="241px" selectable={false}>
                        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                            <TableRow selectable={false}>
                                <TableHeaderColumn>Filename</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={ false }>
                            { files.reverse().map((file, index) => {
                                return (
                                    <TableRow
                                        key={ index }
                                        selectable={ false }
                                    >
                                        <TableRowColumn>
                                            { file }
                                            <IconButton
                                                href={ `/files/result/${file}` }
                                                target="_blank"
                                            >
                                                <FontIcon className="material-icons">file_download</FontIcon>
                                            </IconButton>
                                        </TableRowColumn>
                                    </TableRow>
                                );
                            })};
                        </TableBody>
                    </Table>
                </CardText>
            </Card>
        );
    }
}

ResultTable.propTypes = {
    files: PropTypes.array.isRequired
};

export default ResultTable;
