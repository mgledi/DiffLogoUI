import React, { Component, PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';
import HelpDialog from '../../components/Configuration/helpdialog';
import {Row, Col} from 'react-flexbox-grid';

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
        const{configuration, styles} = this.props;
        const helpdialog = (<HelpDialog
            content={<span>If checked, the cluster tree is displayed on top of the table of difference logos.
                This option applies only in case of more than two input motifs and if the clustering of
                motifs is enabled.</span>}
            title={'Help: Display cluster tree'}/>);
        const checkbox = (<Checkbox
                        onClick={(event) => event.stopPropagation()}
                        onCheck={(event, value) => this.updateEnableClusterTree(value)}
                        label="Display cluster tree"
                        disabled={!configuration.enableClustering}
                        checked={configuration.enableClusterTree && configuration.enableClustering}
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

ClusterTreeCheckbox.propTypes = {
    configuration: PropTypes.object.isRequired,
    writeConfiguration: PropTypes.func.isRequired,
    styles: PropTypes.object.isRequired
};

export default ClusterTreeCheckbox;
