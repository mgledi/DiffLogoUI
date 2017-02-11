import React, { Component } from 'react';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';

const NavigationMenu = (props) => (
      <IconMenu
        {...props}
        iconButtonElement={
            <IconButton>
                <FontIcon className="material-icons" color={ 'white' }>more_vert</FontIcon>
            </IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <Link to="about">
            <MenuItem primaryText="About" />
        </Link>
    </IconMenu>
);

class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AppBar
                title="WebDiffLogo: Comparative visualization of sequence motifs"
                showMenuIconButton={false}
                iconElementRight={ <NavigationMenu /> }
            />
        );
    }
}

export default Header;
