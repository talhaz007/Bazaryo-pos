import React, { useState } from "react";
import "./Category.scss";

const Category = (props) => {
    const [isActive, setActive] = useState(false);

    const toggleClass = () => {
        setActive(!isActive);
    };

    const { image, title, style, onClick, id, index, selectedData } = props;
    const classes = "icons-wrapper " + props.className;

    return (
        <div
            className={index === selectedData ? "selective" : classes}
            style={style}
            onClick={(onClick, toggleClass)}
            id={id}
        >
            <div className="icons-style">{image}</div>
            <p className="text-style">{title}</p>
        </div>
    );
};

export default Category;
