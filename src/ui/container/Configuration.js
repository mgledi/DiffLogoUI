import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardText } from 'material-ui/Card';
import {Row, Col} from 'react-flexbox-grid';

import StackHeightSelect from '../components/Configuration/stack_height_select';
import SymbolHeightSelect from '../components/Configuration/symbol_height_select';
import SequenceLogosCheckbox from '../components/Configuration/seqlogo_checkbox';
import ClusterTreeCheckbox from '../components/Configuration/clustertree_checkbox';
import PvalueCheckbox from '../components/Configuration/pvalue_checkbox';

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
        const { configuration } = this.props;
        return (
            <Card>
                <CardText style={{'height': '300px'}}>
                    <h1>Configuration</h1>
                    <Row around="xs" center="xs" >
                        <Col xs={2}>
                            <StackHeightSelect configuration={configuration} writeConfiguration={this.writeConfiguration}/><br/>
                            <SymbolHeightSelect configuration={configuration} writeConfiguration={this.writeConfiguration}/>
                        </Col>
                        <Col xs={2}>
                            <SequenceLogosCheckbox configuration={configuration} writeConfiguration={this.writeConfiguration}/>
                            <ClusterTreeCheckbox configuration={configuration} writeConfiguration={this.writeConfiguration}/>
                            <PvalueCheckbox configuration={configuration} writeConfiguration={this.writeConfiguration}/>
                        </Col>
                    </Row>
                </CardText>
            </Card>
        );
    }
}

Configuration.propTypes = {
    dispatch: PropTypes.func.isRequired,
    configuration: PropTypes.object.isRequired
};

function mapStateToConfig(state) {
    const { configuration } = state;
    return {
        configuration,
        'timestamp': configuration.timestamp
    };
}

export default connect(mapStateToConfig)(Configuration);
