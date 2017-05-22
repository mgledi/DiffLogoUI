import React, { Component, PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';

const styles = {
    checkBox: {
        width: '250px'
    }
};

class ClusteringCheckbox extends Component {
    constructor(props) {
        super(props);
        this.updateEnableClustering = this.updateEnableClustering.bind(this);
    }

    updateEnableClustering(value) {
        const{configuration, writeConfiguration} = this.props;
        configuration.enableClustering = value;
        writeConfiguration(configuration);
    }

    render() {
        const{configuration} = this.props;
        return (
            <div style={styles.checkBox}>
                <Checkbox
                    onClick={(event) => event.stopPropagation()}
                    onCheck={(event, value) => this.updateEnableClustering(value)}
                    label="Enable motif clustering"
                    checked={configuration.enableClustering}
                    >
                </Checkbox>
            </div>
        );
    }
}

ClusteringCheckbox.propTypes = {
    configuration: PropTypes.object.isRequired,
    writeConfiguration: PropTypes.func.isRequired
};

export default ClusteringCheckbox;
