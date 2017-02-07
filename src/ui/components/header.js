import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';

class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AppBar
                title="WebDiffLogo"
                showMenuIconButton={false}
            />
        );
    }
}

export default Header;
