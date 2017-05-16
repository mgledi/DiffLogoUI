import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const SYMBOLHEIGHT_METHODS = [
    {'value': 'Normalized difference of probabilities'},
    {'value': 'Difference of ICs'}
];

const styles = {
    typeSelect: {
        fontSize: '14px',
        thumbOnColor: 'yellow',
        fill: '#000000'
    },
    labelText: {
        color: '#999',
        textAlign: 'right'
    },
    selectWidth: {
        width: '250px'
    }
};

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
        const{configuration} = this.props;
        return (
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
    }
}

SymbolHeightSelect.propTypes = {
    configuration: PropTypes.object.isRequired,
    writeConfiguration: PropTypes.func.isRequired
};

export default SymbolHeightSelect;
