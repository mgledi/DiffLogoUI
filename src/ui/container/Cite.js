import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, CardText } from 'material-ui/Card';

class Cite extends Component {
    render() {
        return (
            <Card>
                <CardText style={{'height': '300px'}}>
                    <h1>Citation</h1>
                    <p>
                        Nettling, M., Treutler, H., Grau, J., Keilwagen, J., Posch, S., & Grosse, I. (2015). <br/>
                        DiffLogo: a comparative visualization of sequence motifs. <i>BMC bioinformatics</i>, <i>16</i>(1), 387.
                    </p>
                </CardText>
            </Card>
        );
    }
}

export default connect()(Cite);
