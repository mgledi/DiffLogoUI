import React, { Component, PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const FILE_TYPES = [
    {
        'value': 'alignment',
        'disabled': false
    },
    {
        'value': 'fasta',
        'disabled': false
    },
    {
        'value': 'homer',
        'disabled': false
    },
    {
        'value': 'pfm',
        'disabled': false
    },
    {
        'value': 'pwm',
        'disabled': false
    },
    {
        'value': 'jaspar',
        'disabled': false
    },
    {
        'value': 'unknown',
        'disabled': true
    }
];

const styles = {
    typeSelect: {
        fontSize: '14px',
        width: '100px',
        thumbOnColor: 'yellow',
        fill: '#000000'
    }
};

class FileTypeSelect extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { type, index, changeType } = this.props;

        return (
            <SelectField
                onClick={(event) => event.stopPropagation()}
                onChange={(event, selectedIdx, value) => changeType(value, index)}
                value={ type }
                autoWidth={true}
                style={ styles.typeSelect }>
                { FILE_TYPES.map((fileType, menuIndex) => {
                    const { value, disabled } = fileType;

                    return (
                        <MenuItem key={ menuIndex } value={ value } primaryText={ value } disabled={ disabled } />
                    );
                })}
            </SelectField>
        );
    }
}

FileTypeSelect.propTypes = {
    'type': PropTypes.string.isRequired,
    'index': PropTypes.number.isRequired,
    'changeType': PropTypes.func.isRequired
};

export default FileTypeSelect;
