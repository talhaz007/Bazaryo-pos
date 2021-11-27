import React from "react";
import defaultImage from "../../../Assets/img/placeholder.png";
import "./Avatar.scss";

const Avatar = (props) => {
    const {
        userImage,
        userName,
        size,
        className,
        onClickMain,
        onClickChangePhoto,
    } = props;

    const hoverToEdit = onClickChangePhoto ? "hover-edit" : "";
    const hover = onClickMain ? "hover-pointer" : hoverToEdit;
    return (
        <div
            className={`avatar-wrapper ${size || ""} ${
                className || ""
            } ${hover}`}
            onClick={onClickMain}
        >
            <label htmlFor="myfile">
                <img
                    src={userImage || defaultImage}
                    alt={`${userName || "profile"}`}
                />
                <div className="change-photo-wrapper">
                    <div className="edit-icon" />
                    <div className="edit-text">Change photo</div>
                </div>
            </label>
            <input
                type="file"
                id="myfile"
                name="myfile"
                onChange={onClickChangePhoto}
                style={{ display: "none" }}
            />
        </div>
    );
};

export default Avatar;
