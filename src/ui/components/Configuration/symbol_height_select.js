import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import HelpDialog from '../../components/Configuration/helpdialog';
import {Row, Col} from 'react-flexbox-grid';

const SYMBOLHEIGHT_METHODS = [
    {'value': 'Normalized difference of probabilities'},
    {'value': 'Difference of ICs'}
];

class SymbolHeightSelect extends Component {
    constructor(props) {
        super(props);
        this.updateSymbolHeight = this.updateSymbolHeight.bind(this);
    }

    updateSymbolHeight(value) {
        const{configuration, writeConfiguration} = this.props;
        configuration.symbolHeightMethod = value;
        writeConfiguration(configuration);
    }

    render() {
        const{configuration, styles} = this.props;
        const helpdialog = (<HelpDialog
            content={<div>
                         <p>The user is able to select the measure for the determination of symbol sizes in the difference logo.
                        Depending on the measure, different properties are emphasized. Please find the mathematical details
                        in section 3.2 in <a href='https://static-content.springer.com/esm/art%3A10.1186%2Fs12859-015-0767-x/MediaObjects/12859_2015_767_MOESM1_ESM.pdf' target='_blank'>Additional File 1</a> of
                        the <a href='https://bmcbioinformatics.biomedcentral.com/articles/10.1186/s12859-015-0767-x' target='_blank'>DiffLogo publication</a>. There are the following measures.</p>

                        <p><b>Normalized difference of probabilities</b> The Normalized difference of probabilities is a measure for the
                        change of symbol-specific probability relative to the sum of absolute symbol-specific probabilitiesy differences
                        of the given probability distributions. The Normalized difference of probabilities is antisymmetric and limited
                        to [-1/2, 1/2]. This measure especially emphasizes a large change of symbol-probability. For each position of the
                        difference logo, the height of the symbol stack with negative values is equal to the height of the symbol stack with
                        positive values, because each gain of symbol--probability implies a loss of probability for the remaining symbols and
                        vice versa. Please find mathematical details in section 3.2.1 in <a href='https://static-content.springer.com/esm/art%3A10.1186%2Fs12859-015-0767-x/MediaObjects/12859_2015_767_MOESM1_ESM.pdf' target='_blank'>here</a>.</p>

                        <p><b>Difference of information contents (ICs)</b> The Difference of information contents is a measure for the
                        symbol-specific change of information content relative to the sum of absolute symbol-specific differences
                        of information content of the given probability distributions. The Difference of information contents is
                        antisymmetric and limited to [−1, 1]. This measure especially emphasizes a large change of symbol-specific
                        information content. Please find mathematical details in section 3.2.2 in <a href='https://static-content.springer.com/esm/art%3A10.1186%2Fs12859-015-0767-x/MediaObjects/12859_2015_767_MOESM1_ESM.pdf' target='_blank'>here</a>.</p>
                    </div>}
            title={'Help: Method for height of a symbol'}/>);
        const select = (
            <div style={ styles.selectWidth }>
                <div style={ styles.labelText }>Method for height of a symbol</div>
                <SelectField
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event, selectedIdx, value) => this.updateSymbolHeight(value)}
                    autoWidth={true}
                    style={ styles.typeSelect }
                    value={configuration.symbolHeightMethod}
                    >
                    { SYMBOLHEIGHT_METHODS.map((type, menuIndex) => {
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

SymbolHeightSelect.propTypes = {
    configuration: PropTypes.object.isRequired,
    writeConfiguration: PropTypes.func.isRequired,
    styles: PropTypes.object.isRequired
};

export default SymbolHeightSelect;
