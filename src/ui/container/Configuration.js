import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardText } from 'material-ui/Card';
import {Row, Col} from 'react-flexbox-grid';
import { withRouter } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

import StackHeightSelect from '../components/Configuration/stack_height_select';
import SymbolHeightSelect from '../components/Configuration/symbol_height_select';
import SequenceLogosCheckbox from '../components/Configuration/seqlogo_checkbox';
import ClusterTreeCheckbox from '../components/Configuration/clustertree_checkbox';
import ClusteringCheckbox from '../components/Configuration/clustering_checkbox';
import PvalueCheckbox from '../components/Configuration/pvalue_checkbox';
import AlignmentCheckbox from '../components/Configuration/alignment_checkbox';

import {
    getConfiguration,
    writeConfiguration
} from '../actions';

class Configuration extends Component {

    constructor(props) {
        super(props);
        this.writeConfiguration = this.writeConfiguration.bind(this);
    }

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(getConfiguration());
    }

    writeConfiguration(configuration) {
        const { dispatch } = this.props;
        dispatch(writeConfiguration(configuration));
    }

    render() {
        const { configuration, router } = this.props;
        return (
            <Card>
                <CardText style={{'height': '300px'}}>
                    <h1>Configuration</h1>
                    <Row start="xs" >
                        <Col xs={4}>
                            <StackHeightSelect configuration={configuration} writeConfiguration={this.writeConfiguration}/><br/>
                            <SymbolHeightSelect configuration={configuration} writeConfiguration={this.writeConfiguration}/>
                        </Col>
                        <Col xs={4} end="xs">
                            <SequenceLogosCheckbox configuration={configuration} writeConfiguration={this.writeConfiguration}/>
                            <PvalueCheckbox configuration={configuration} writeConfiguration={this.writeConfiguration}/>
                            <ClusteringCheckbox configuration={configuration} writeConfiguration={this.writeConfiguration}/>
                            <ClusterTreeCheckbox configuration={configuration} writeConfiguration={this.writeConfiguration}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={8} >
                            <Row center="xs">
                                <RaisedButton
                                label='Back to analysis'
                                overlayStyle={{ 'overflowX': 'hidden', 'overflowY': 'hidden' }}
                                labelPosition={'before'}
                                primary={ true }
                                fullWidth={false}
                                onClick={() => router.push('/')}/>
                            </Row>
                        </Col>
                    </Row>
                </CardText>
            </Card>
        );
    }
}

Configuration.propTypes = {
    dispatch: PropTypes.func.isRequired,
    configuration: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
};

function mapStateToConfig(state) {
    const { configuration } = state;
    return {
        configuration
    };
}

// router is provided by header
export default connect(mapStateToConfig)(Configuration);
