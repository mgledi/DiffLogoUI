import React, { Component, PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';
import HelpDialog from '../../components/Configuration/helpdialog';
import {Row, Col} from 'react-flexbox-grid';

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
        const{configuration, styles} = this.props;
        const helpdialog = (<HelpDialog
            content={<span>If checked, p-values for the significance of motif differences are calculated and displayed. More specifically, for each pair of input motifs and for each aligned motif position a permutation test is applied to calculate the p-value for the null hypothesis that both sets of given symbols are sampled from the same symbol distribution. The significance of the according symbol stack of the according difference logo is displayed with an asterisk for a p-values smaller than 0.05, two asterisks for a p-value smaller than 0.01, and three asterisks for a p-value smaller than 0.001.</span>}
            title={'Help: Calculate position-wise p-values'}/>);
        const checkbox = (<Checkbox
                        onClick={(event) => event.stopPropagation()}
                        onCheck={(event, value) => this.updateEnablePvalue(value)}
                        label="Calculate position-wise p-values"
                        checked={configuration.enablePvalue}
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

PvalueCheckbox.propTypes = {
    configuration: PropTypes.object.isRequired,
    writeConfiguration: PropTypes.func.isRequired,
    styles: PropTypes.object.isRequired
};

export default PvalueCheckbox;
