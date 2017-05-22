import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const STACKHEIGHT_METHODS = [
    {'value': 'Shannon-Divergence'},
    {'value': 'Sum of absolute probability differences'},
    {'value': 'Sum of absolute IC differences'},
    {'value': 'Loss of absolute IC differences'}
];

const styles = {
    typeSelect: {
        fontSize: '14px',
        thumbOnColor: 'yellow',
        fill: '#000000'
    },
    labelText: {
        color: '#999',
        textAlign: 'left'
    },
    selectWidth: {
        width: '250px'
    }
};

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
        const{configuration} = this.props;
        return (
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
    }
}

StackHeightSelect.propTypes = {
    configuration: PropTypes.object.isRequired,
    writeConfiguration: PropTypes.func.isRequired
};

export default StackHeightSelect;
