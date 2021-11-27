import React from "react";
import { FaCartPlus } from "react-icons/fa";
import "./Products.scss";

const Product = (props) => {
    const { image, title, price, onClick, description } = props;
    const classes = "products-wrapper " + props.className;

    return (
        <div className={classes}>
            <div className="image-wrap">
                <div className="image-part">
                    <img src={image} className="img-style" />
                </div>
                <div className="button-wrapper">
                    <div className="title-style">{title}</div>
                    {/* {/ <div className="descStyle">{description}</div> /} */}
                </div>
            </div>
            <div className="price-wrapper">
                <sup>Rs</sup>
                <span className="price-style">{price}</span>
            </div>
            <div>
                <div>
                    <div>
                        <button onClick={onClick}>
                            <FaCartPlus />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
