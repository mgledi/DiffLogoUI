import React, { Component, PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';
import HelpDialog from '../../components/Configuration/helpdialog';
import {Row, Col} from 'react-flexbox-grid';

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
        const{configuration, styles} = this.props;
        const helpdialog = (<HelpDialog
            content={<span>If checked, the input motifs will be clustered by their overall similarity. This option applies only in case of more than two input motifs. The clustering of motifs has the advantage that similar motifs are placed close to each other and dissimilar motifs are placed apart to each other. The resulting table of difference logos is more clearly arranged and it is possible to detect subsets of similar motifs by eye.</span>}
            title={'Help: Enable motif clustering'}/>);
        const checkbox = (<Checkbox
                    onClick={(event) => event.stopPropagation()}
                    onCheck={(event, value) => this.updateEnableClustering(value)}
                    label="Enable motif clustering"
                    checked={configuration.enableClustering}
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

ClusteringCheckbox.propTypes = {
    configuration: PropTypes.object.isRequired,
    writeConfiguration: PropTypes.func.isRequired,
    styles: PropTypes.object.isRequired
};

export default ClusteringCheckbox;
