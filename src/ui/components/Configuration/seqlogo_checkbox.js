import React, { Component, PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';

const styles = {
    checkBox: {
        width: '250px'
    }
};

class SequenceLogosCheckbox extends Component {
    constructor(props) {
        super(props);
        this.updateEnableSequenceLogos = this.updateEnableSequenceLogos.bind(this);
    }

    updateEnableSequenceLogos(value) {
        const{configuration, writeConfiguration} = this.props;
        configuration.enableSequenceLogos = value;
        writeConfiguration(configuration);
    }

    render() {
        const{configuration} = this.props;
        return (
            <div style={styles.checkBox}>
                <Checkbox
                    onClick={(event) => event.stopPropagation()}
                    onCheck={(event, value) => this.updateEnableSequenceLogos(value)}
                    label="Display sequence logos"
                    checked={configuration.enableSequenceLogos}
                    >
                </Checkbox>
            </div>
        );
    }
}

SequenceLogosCheckbox.propTypes = {
    configuration: PropTypes.object.isRequired,
    writeConfiguration: PropTypes.func.isRequired
};

export default SequenceLogosCheckbox;
