import React, { Component, PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';

const styles = {
    checkBox: {
        width: '250px'
    }
};

class PvalueCheckbox extends Component {
    constructor(props) {
        super(props);
        this.updateEnablePvalue = this.updateEnablePvalue.bind(this);
    }

    updateEnablePvalue(value) {
        const{configuration, writeConfiguration} = this.props;
        configuration.enablePvalue = value;
        writeConfiguration(configuration);
    }

    render() {
        const{configuration} = this.props;
        return (
            <div style={styles.checkBox}>
                <Checkbox
                    onClick={(event) => event.stopPropagation()}
                    onCheck={(event, value) => this.updateEnablePvalue(value)}
                    label="Calculate positione-wise p-values"
                    checked={configuration.enablePvalue}
                    >
                </Checkbox>
            </div>
        );
    }
}

PvalueCheckbox.propTypes = {
    configuration: PropTypes.object.isRequired,
    writeConfiguration: PropTypes.func.isRequired
};

export default PvalueCheckbox;
