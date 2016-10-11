import React, { Component, PropTypes} from 'react';
import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Checkbox from 'material-ui/Checkbox';
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import FlatButton from'material-ui/FlatButton';

function renderDeleteButton(onDelete, index) {
    return (
        <IconButton onClick={ (event) => onDelete(event, index) } >
            <FontIcon className="material-icons">clear</FontIcon>
        </IconButton>
    );
}

function renderList(list, selected, onSelect, onDelete) {
    return list.map((item, index) => {
        return (
            <ListItem
                key={ index }
                primaryText={ item.name }
                onClick={ () => onSelect(index) }
                leftCheckbox={<Checkbox checked={ selected === index } />}
                rightIconButton={ renderDeleteButton(onDelete, index) }
            />
        );
    });
}

class AnalysisList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: true
        };
        this.handleExpandChange = this.handleExpandChange.bind(this);
    }

    handleExpandChange(expanded) {
        this.setState({ expanded: expanded });
    }

    render() {
        const { analysis, selected, onSelect, onDelete, addAnalysis } = this.props;

        return (
            <Card expanded={ this.state.expanded } onExpandChange={ this.handleExpandChange } >
                <CardHeader title="Analysis" actAsExpander={true} showExpandableButton={true} />
                <CardText expandable={true} >
                    <List style={{ height: '300px', overflow: 'scroll' }}>
                        { renderList(analysis, selected, onSelect, onDelete) }
                    </List>
                </CardText>
                <CardActions>
                    <FlatButton label="Add Analysis" onClick={ addAnalysis } />
                </CardActions>
            </Card>
        );
    }
}

AnalysisList.propTypes = {
    analysis: PropTypes.array.isRequired,
    selected: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    addAnalysis: PropTypes.func.isRequired
};

export default AnalysisList;
