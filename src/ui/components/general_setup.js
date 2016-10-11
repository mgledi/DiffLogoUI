import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';

class GeneralConfig extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card>
                <CardHeader
                    title="General Setup"
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardText expandable={true}>
                    <TextField
                        id="image-width"
                        floatingLabelText="Width of the produced image"
                        floatingLabelFixed={true}
                        defaultValue="1200"
                    />
                    <TextField
                        id="image-height"
                        floatingLabelText="Height of the produced image"
                        floatingLabelFixed={true}
                        defaultValue="900"
                    />
                </CardText>
            </Card>
        );
    }
}

export default GeneralConfig;
