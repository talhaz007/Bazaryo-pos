import React from "react";
import Avatar from "../Avatar/Avatar";
import "./AvatarProvider.scss";

const AvatarProvider = (props) => {
    const {
        providerImage,
        providerName,
        className,
        barClassName,
        onClickChangePhoto,
        onClickMain,
    } = props;
    return (
        <div className={`provider-avatar-wrapper ${className || ""}`}>
            <Avatar
                userImage={providerImage}
                userName={providerName}
                size="large"
                className="provider-avatar"
                onClickChangePhoto={onClickChangePhoto}
                onClickMain={onClickMain}
            />
            <div className={`provider-bar ${barClassName || ""}`}>
                <span>Provider</span>
            </div>
        </div>
    );
};

export default AvatarProvider;
