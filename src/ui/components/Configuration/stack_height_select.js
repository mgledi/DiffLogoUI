import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import HelpDialog from '../../components/Configuration/helpdialog';
import {Row, Col} from 'react-flexbox-grid';

const STACKHEIGHT_METHODS = [
    {'value': 'Shannon-Divergence'},
    {'value': 'Sum of absolute probability differences'},
    {'value': 'Sum of absolute IC differences'},
    {'value': 'Loss of absolute IC differences'}
];

class StackHeightSelect extends Component {
    constructor(props) {
        super(props);
        this.updateStackHeight = this.updateStackHeight.bind(this);
    }

    updateStackHeight(value) {
        const{configuration, writeConfiguration} = this.props;
        configuration.stackHeightMethod = value;
        writeConfiguration(configuration);
    }

    render() {
        const{configuration, styles} = this.props;
        const helpdialog = (<HelpDialog
            content={<div>
                        <p>The user is able to select the measure for the quantification of symbol distribution differences which determines
                        the heigth of each symbol stack in the difference logo. Depending on the measure, different properties are emphasized.
                        Please find the mathematical details in section 3.1 in <a href='https://static-content.springer.com/esm/art%3A10.1186%2Fs12859-015-0767-x/MediaObjects/12859_2015_767_MOESM1_ESM.pdf' target='_blank'>Additional File 1</a> of
                        the <a href='https://bmcbioinformatics.biomedcentral.com/articles/10.1186/s12859-015-0767-x' target='_blank'>DiffLogo publication</a>.
                        There are the following measures.</p>

                        <p><b>Shannon-Divergence</b> The Jensen–Shannon divergence is a measure for the difference of two probability
                        distributions based on information theory. This measure is symmetric and limited to [0, 1]. This measure especially
                        emphasizes large distribution differences. Please find mathematical details in section 3.1.1
                        in <a href='https://static-content.springer.com/esm/art%3A10.1186%2Fs12859-015-0767-x/MediaObjects/12859_2015_767_MOESM1_ESM.pdf' target='_blank'>here</a>.</p>

                        <p><b>Sum of absolute probability differences</b> The Sum of absolute probability differences is a measure for the
                        absolute change of probabilities between two probability distributions. The Sum of absolute probability differences
                        is symmetric and limited to [0, 2]. This measure especially emphasizes large changes of probabilities. Please find
                        mathematical details in section 3.1.4
                        in <a href='https://static-content.springer.com/esm/art%3A10.1186%2Fs12859-015-0767-x/MediaObjects/12859_2015_767_MOESM1_ESM.pdf' target='_blank'>here</a>.</p>

                        <p><b>Sum of absolute information content (IC) differences</b> The Sum of absolute IC differences is a measure for
                        the absolute change of information content between two probability distributions. The Sum of absolute IC differences
                        is symmetric and limited to [0, 2*log2(alphabet size)]. This measure especially emphasizes large changes of information
                        content. Please find mathematical details in section 3.1.2
                        in <a href='https://static-content.springer.com/esm/art%3A10.1186%2Fs12859-015-0767-x/MediaObjects/12859_2015_767_MOESM1_ESM.pdf' target='_blank'>here</a>.</p>

                        <p><b>Loss of absolute information content (IC) differences</b> The Loss of absolute IC differences is a measure for
                        the absolute change of information content relative to the average information content of two probability distributions.
                        The Loss of absolute IC differences is limited to [0, 2*log2(alphabet size)]. This measure especially emphasizes large
                        changes of information content relative to the information content of the given distributions. Please find mathematical details in section 3.1.3
                        in <a href='https://static-content.springer.com/esm/art%3A10.1186%2Fs12859-015-0767-x/MediaObjects/12859_2015_767_MOESM1_ESM.pdf' target='_blank'>here</a>.</p>
                    </div>}
            title={'Help: Method for height of a stack'}/>);
        const select = (
            <div style={ styles.selectWidth }>
                <div style={ styles.labelText }>Method for height of a stack</div>
                <SelectField
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event, selectedIdx, value) => this.updateStackHeight(value)}
                    autoWidth={true}
                    style={ styles.typeSelect }
                    value={configuration.stackHeightMethod}
                    >
                    { STACKHEIGHT_METHODS.map((type, menuIndex) => {
                        const { value } = type;

                        return (
                            <MenuItem key={ menuIndex } value={ value } primaryText={ value } />
                        );
                    })}
                </SelectField>
            </div>
        );

        return (
             <Row middle="xs">
                <Col>
                    {select}
                </Col>
                <Col>
                    {helpdialog}
                </Col>
            </Row>
        );
    }
}

StackHeightSelect.propTypes = {
    configuration: PropTypes.object.isRequired,
    writeConfiguration: PropTypes.func.isRequired,
    styles: PropTypes.object.isRequired
};

export default StackHeightSelect;
