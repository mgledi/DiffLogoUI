import React, { Component, PropTypes } from 'react';
import findIndex from 'lodash/findIndex';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ResultTable from './resultTable';

class Results extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dialogOpen: false,
            dialogContentUrl: ''
        };

        this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { results } = nextProps;
        const unseen = findIndex(results, 'adhoc');

        if (unseen > -1) {
            const adhoc = results[unseen];
            this.setState({
                dialogOpen: true,
                dialogContentUrl: `/files/result/${adhoc.timestamp}/${adhoc.files[0]}`,
                adhoc: unseen
            });
        }

    }

    openDialog(event, url) {
        event.preventDefault();

        this.setState({
            dialogOpen: true,
            dialogContentUrl: url
        });
    }

    closeDialog() {
        const { adhoc } = this.state;
        const { update, results } = this.props;

        if (adhoc > -1) {
            results[adhoc].adhoc = false;
            update(results);
        }

        this.setState({
            dialogOpen: false,
            adhoc: -1
        });
    }

    /*
     * special dialog style needed because of
     * https://github.com/callemall/material-ui/issues/1676
    */
    render() {
        const { results } = this.props;
        const { dialogOpen, dialogContentUrl } = this.state;

        return (
            <div>
                <Card>
                    <CardHeader title="Your results"/>
                    <CardText>
                        <ResultTable results={ results } dialog={ this.openDialog }/>
                    </CardText>
                </Card>
                <Dialog
                    title="Dialog With Actions"
                    modal={false}
                    open={dialogOpen}
                    style={{ paddingTop: 0 }}
                    contentStyle={{ maxWidth: '90vw', maxHeight: '90vw' }}
                    repositionOnUpdate={ false }
                    onRequestClose={ this.closeDialog }
                    autoScrollBodyContent={true}
                    actions={[
                        <FlatButton
                                label="Close"
                                primary={true}
                                onTouchTap={this.closeDialog}
                              />
                    ]}
                >
                    <img src={ dialogContentUrl } style={{ width: '100%' }}/>
                </Dialog>
            </div>
        );
    }
}

Results.propTypes = {
    results: PropTypes.array.isRequired,
    update: PropTypes.func.isRequired
};

export default Results;
