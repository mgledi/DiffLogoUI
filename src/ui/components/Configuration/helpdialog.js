import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

class HelpDialog extends Component {
    state = {
        open: false
    };

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    constructor(props) {
        super(props);
    }

    render() {
        const close = <FlatButton label="Close" primary={true} onTouchTap={this.handleClose}/>;
        const {title, content} = this.props;
        return (
            <div>
                <IconButton iconClassName="material-icons" onTouchTap={this.handleOpen}>
                  help_outline
                </IconButton>
                <Dialog
                  title={title}
                  actions={close}
                  modal={false}
                  open={this.state.open}
                  onRequestClose={this.handleClose}
                  autoScrollBodyContent={true}
                >
                {content}
                </Dialog>
            </div>
        );
    }
}

HelpDialog.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.object.isRequired
};

export default HelpDialog;
