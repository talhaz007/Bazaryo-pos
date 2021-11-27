import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

import "./SelectInput.scss";

const SelectInput = (props) => {
    const { t } = useTranslation("options");
    const {
        options,
        id,
        name,
        onChange,
        selectedValue,
        placeHolder,
        placeHolderStyle,
        disabled,
        label,
        required,
        outlined,
        transparent,
        menuWrapper,
        inputWidth,
    } = props;

    const [showItems, setShowItems] = useState(false);
    const [selectedItem, setSelectedItem] = useState(
        selectedValue || placeHolder
    );
    let labelWrapper = "";
    if (label) {
        labelWrapper = (
            <span className={`label${required ? " required" : ""}`}>
                {label}
            </span>
        );
    }

    const dropDown = () => {
        setShowItems(!showItems);
    };

    const selectItem = (item) => {
        setSelectedItem(item);
        setShowItems(false);
        onChange(item);
    };

    const outsideClick = useCallback(() => {
        if (showItems) {
            setShowItems(false);
        }
    }, [showItems]);

    useEffect(() => {
        window.addEventListener("click", outsideClick);
        return () => window.removeEventListener("click", outsideClick);
    });
    if (!options) return false;
    return (
        <div className={`selector-box ${inputWidth || ""}`} id={id}>
            {labelWrapper}
            <input type="hidden" name={name} value={selectedItem} />
            <div
                className={`selector-wrapper ${name || ""}
                    ${disabled ? " disabled" : ""}
                    ${outlined ? " outlined" : ""}
                    ${transparent ? " transparent" : ""}`}
                onClick={dropDown}
            >
                <div
                    className={`select-box-selected-item${
                        selectedItem !== placeHolder ? " selected" : ""
                    }`}
                >
                    {name === "language" ? (
                        <span className={`lg-flag-wrapper ${selectedItem}`} />
                    ) : (
                        ""
                    )}
                    {name === "amount" && selectedItem !== "Amount"
                        ? "Amount: "
                        : ""}
                    <span className={placeHolderStyle}>{t(selectedItem)}</span>
                    {outlined || transparent ? (
                        <span className="arrow-wrapper" />
                    ) : (
                        ""
                    )}
                </div>
                <div
                    className={`select-items-wrappers${
                        showItems ? " block" : ""
                    } ${menuWrapper || ""}`}
                >
                    {options.map((option) => (
                        <div
                            key={option}
                            onClick={() => selectItem(option)}
                            className={["select item", option].join(" ")}
                        >
                            {t(option)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SelectInput;
