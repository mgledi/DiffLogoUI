import React, { Component, PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';

const styles = {
    checkBox: {
        width: '270px'
    }
};

class AlignmentCheckbox extends Component {
    constructor(props) {
        super(props);
        this.updateEnableAlignment = this.updateEnableAlignment.bind(this);
    }

    updateEnableAlignment(value) {
        const{configuration, writeConfiguration} = this.props;
        configuration.enableMotifAlignment = value;
        writeConfiguration(configuration);
    }

    render() {
        const{configuration} = this.props;
        return (
            <div style={styles.checkBox}>
                <Checkbox
                    onClick={(event) => event.stopPropagation()}
                    onCheck={(event, value) => this.updateEnableAlignment(value)}
                    label="Enable motif alignment"
                    checked={configuration.enableMotifAlignment}
                    >
                </Checkbox>
            </div>
        );
    }
}

AlignmentCheckbox.propTypes = {
    configuration: PropTypes.object.isRequired,
    writeConfiguration: PropTypes.func.isRequired
};

export default AlignmentCheckbox;
