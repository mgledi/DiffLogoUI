import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import {Row, Col} from 'react-flexbox-grid';

const Footer = () => {
    return (
        <Row around="xs" center="xs" >
            <Col xs={2}>
                <FlatButton
                    label="Report Bug"
                    href="https://github.com/mgledi/DiffLogoUI/issues/new"
                    target="_blank"
                    icon={ <FontIcon className="material-icons">report</FontIcon> }
                    primary={ true }
                />
            </Col>
            <Col xs={2}>
                <FlatButton
                    label="Request Feature"
                    href="https://github.com/mgledi/DiffLogoUI/issues/new"
                    target="_blank"
                    icon={ <FontIcon className="material-icons">add_circle</FontIcon> }
                    primary={ true }
                />
            </Col>
            <Col xs={2}>
                <FlatButton
                    label="Need Help"
                    href="https://github.com/mgledi/DiffLogoUI/wiki"
                    target="_blank"
                    icon={ <FontIcon className="material-icons">help</FontIcon> }
                    primary={ true }
                />
            </Col>
        </Row>
    );
};

export default Footer;
