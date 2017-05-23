import React, { Component, PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';
import HelpDialog from '../../components/Configuration/helpdialog';
import {Row, Col} from 'react-flexbox-grid';

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
        const{configuration, styles} = this.props;
        const helpdialog = (<HelpDialog
            content={<span>If checked, the sequence logos of the input motifs will be displayed on top of the table of difference logos. This option applies only in case of more than two input motifs.</span>}
            title={'Help: Display sequence logos'}/>);
        const checkbox = (<Checkbox
                    onClick={(event) => event.stopPropagation()}
                    onCheck={(event, value) => this.updateEnableSequenceLogos(value)}
                    label="Display sequence logos"
                    checked={configuration.enableSequenceLogos}
                    style={styles.checkBox}/>);
        return (
             <Row middle="xs">
                <Col>
                    {checkbox}
                </Col>
                <Col>
                    {helpdialog}
                </Col>
            </Row>
        );
    }
}

SequenceLogosCheckbox.propTypes = {
    configuration: PropTypes.object.isRequired,
    writeConfiguration: PropTypes.func.isRequired,
    styles: PropTypes.object.isRequired
};

export default SequenceLogosCheckbox;
