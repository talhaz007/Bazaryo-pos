import React from 'react';

import './MiniCart.scss';

const MiniCart = (props) => {
    const {
        disabled,
        onClick,
        value
    } = props;
    let counterWrapper;
    if (value) {
        counterWrapper = <span className="counter-wrapper">{value}</span>;
    }
    return (
        <button
            type="button"
            className="minicart-wrapper"
            onClick={onClick}
            disabled={disabled}
        >
            {disabled ? null : counterWrapper}
        </button>
    );
};

export default MiniCart;
