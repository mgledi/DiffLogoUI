import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';

class SeqLogoThumbnail extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { file, index, switchOrientation, openPopup } = this.props;

        if (file.error !== '') {
            return (
                <span style={{ 'color': '#D33' }} >Can not parse file: {file.error}</span>
            );
        }

        if (file.seqLogoFileSparse !== '') {
            const seqLogoFileSparse = `/results/seq-logo/${file.seqLogoFileSparse}`;

            return (
                <div>
                    <img
                        onClick={(event) => openPopup(event, index)}
                        width='120'
                        src={seqLogoFileSparse}
                        style={{cursor: 'pointer', float: 'left'}}
                    />
                    <span>
                        <IconButton iconClassName="material-icons"
                            iconStyle={{ 'fontSize': '20px' }}
                            onClick={(event) => switchOrientation(event, index)}
                        >swap_horiz</IconButton>
                    </span>
                </div>
            );
        }

        return (
            <span>…</span>
        );
    }
}

SeqLogoThumbnail.propTypes = {
    'file': PropTypes.object.isRequired,
    'index': PropTypes.number.isRequired,
    'switchOrientation': PropTypes.func.isRequired,
    'openPopup': PropTypes.func.isRequired
};

export default SeqLogoThumbnail;
