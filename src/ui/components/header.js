import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';

const NavigationMenu = ({navigateTo, ...props}) => (
    <IconMenu
        {...props}
        iconButtonElement={
            <IconButton>
                <FontIcon className="material-icons" color={ 'white' }>menu</FontIcon>
            </IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}

    >
        <MenuItem primaryText="Analysis" onClick={ () => navigateTo('/') }/>
        <MenuItem rightIcon={<FontIcon className="material-icons">settings</FontIcon>} primaryText="Configure" onClick={ () => navigateTo('config') }/>
        <MenuItem primaryText="About" onClick={ () => navigateTo('about') } />
        <MenuItem primaryText="Cite" onClick={ () => navigateTo('cite') } />
        <MenuItem primaryText="Supported file formats" onClick={ () => navigateTo('fileformats') } />
    </IconMenu>
);

NavigationMenu.propTypes = {
    navigateTo: PropTypes.func.isRequired
};

// #############
class Header extends Component {
    constructor(props) {
        super(props);
        this.navigate = this.navigate.bind(this);
    }

    navigate(path) {
        const { router } = this.props;

        router.push(path);
    }

    render() {
        return (
            <AppBar
                title="WebDiffLogo: Alignment, clustering, and comparative visualization of sequence motifs"
                showMenuIconButton={true}
                iconElementLeft={ <NavigationMenu navigateTo={ this.navigate } /> }
            />
        );
    }
}

Header.propTypes = {
    router: PropTypes.object.isRequired
};

export default withRouter(Header);
