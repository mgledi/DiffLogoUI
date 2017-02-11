import React, { Component } from 'react';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';

const styles = {
    link: {
        color: 'black',
        textDecoration: 'none'
    }
}

const NavigationMenu = (props) => (
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
        <Link to="analysis" style={styles.link}>
            <MenuItem   primaryText="Analysis"/>
        </Link>
        <Link to="about" style={styles.link}>
            <MenuItem primaryText="About"/>
        </Link>
        <Link to="cite" style={styles.link}>
            <MenuItem primaryText="Cite"/>
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
                showMenuIconButton={true}
                iconElementLeft={ <NavigationMenu /> }
            />
        );
    }
}

export default Header;
