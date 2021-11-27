import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import "./_sidebar.scss";

const Sidebar = (props) => {
    const {
        image,
        title,
        price,
        onDelete,
        quantity,
        imagePlus,
        imageMinus,
        onClickPlus,
        onClickMinus,
    } = props;
    const classes = "sidebar-wrapper " + props.className;
    return (
        <div className={classes}>
            <div className="image-wrap">
                <div>
                    <img src={image} className="img-style" />
                </div>
                <div className="button-wrapper">
                    <div className="title-style">{title}</div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <div
                            style={{
                                color: "black",
                                fontSize: "12px",
                                fontWeight: 600,
                            }}
                        >
                            x {quantity}
                        </div>{" "}
                        <div
                            style={{
                                marginLeft: "75px",
                                color: "#a3a1a1",
                                fontSize: "12px",
                                fontWeight: 600,
                            }}
                        >
                            <sup>Rs </sup>
                            {price}
                        </div>
                    </div>
                </div>
                <div style={{ marginLeft: 5 }}>
                    <div style={{ display: "flex" }}>
                        <div onClick={onClickPlus}>{imagePlus}</div>
                        <div onClick={onDelete} style={{ marginTop: "25px" }}>
                            {<FaTrashAlt />}
                        </div>
                    </div>
                    <div onClick={onClickMinus}>{imageMinus}</div>
                </div>
            </div>
            <div>
                <div></div>
            </div>
        </div>
    );
};

export default Sidebar;
