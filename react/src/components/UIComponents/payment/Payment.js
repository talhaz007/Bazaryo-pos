import React, { useState } from "react";
import "./Payment.scss";

const Payment = (props) => {
    const { image, title, onClick } = props;
    const classes = "payment-wrapper " + props.className;

    return (
        <div className="all-paymentwrap">
            <div className={classes} onClick={onClick}>
                <div className="icons-style">{image}</div>
                <p className="text-style">{title}</p>
            </div>
        </div>
    );
};

export default Payment;
