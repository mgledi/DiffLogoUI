import React, { Component, PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';

const styles = {
    checkBox: {
        width: '250px'
    }
};

class ClusterTreeCheckbox extends Component {
    constructor(props) {
        super(props);
        this.updateEnableClusterTree = this.updateEnableClusterTree.bind(this);
    }

    updateEnableClusterTree(value) {
        const{configuration, writeConfiguration} = this.props;
        configuration.enableClusterTree = value;
        writeConfiguration(configuration);
    }

    render() {
        const{configuration} = this.props;
        return (
            <div style={styles.checkBox}>
                <Checkbox
                    onClick={(event) => event.stopPropagation()}
                    onCheck={(event, value) => this.updateEnableClusterTree(value)}
                    label="Show cluster tree"
                    checked={configuration.enableClusterTree}
                    >
                </Checkbox>
            </div>
        );
    }
}

ClusterTreeCheckbox.propTypes = {
    configuration: PropTypes.object.isRequired,
    writeConfiguration: PropTypes.func.isRequired
};

export default ClusterTreeCheckbox;
