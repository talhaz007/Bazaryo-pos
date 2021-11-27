import React, { useState, useEffect } from "react";
import { FaUser, FaChevronRight, FaBackspace, FaHome } from "react-icons/fa";
import { connect } from "react-redux";
import Localbase from "localbase";
import { cartUpdate } from "../../store/actions";
import productImage from "../../Assets/img/product.png";
import History from "../../Navigation/History";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import "./PosPage.scss";

const PosPage = (props) => {
    let db = new Localbase("db");
    const { value } = props;
    const [mounted, setMounted] = useState(false);
    const [summaryData, setSummaryData] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [total, setTotal] = useState(0);
    const [selectedData, setSelectedData] = useState(-1);
    const [calUnit, setCalUnit] = useState();
    const [numPadCount, setNumPadCount] = useState("");
    const [discountPad, setDiscountPad] = useState("");
    const [pricePad, setPricePad] = useState("");
    const [formula, setFormula] = useState("quantity");
    const [categories, setCategories] = useState([]);

    if (!mounted) {
        fetch(`http://localhost:8765/apis/categories`, {
            method: "GET",
            headers: {
                "Access-Control-Allow-Headers": "*",
                "API-RESPONSE-FORMAT": "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data, "categoriessssss");
                db.collection("categories").set(data);
            });
        db.collection("categories")
            .get()
            .then((data) => {
                console.log(data);
                setCategories(data);
            });

        db.collection("products")
            .get()
            .then((productdb) => {
                console.log(productdb, "consoledb");
                setProductsData(productdb);
            });
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    // const onCategoryChange = (id) => {
    //     const filtered = productsData.filter(
    //         (d) => d.core_product_type_id === id
    //     );
    //     productsData(filtered);
    // };

    console.log(productsData, "pdbbb");

    const onEditProduct = (id) => {
        History.push(`/editproduct/${id}`);
    };

    const onDeleteProduct = (id) => {
        db.collection("products")
            .doc({ id: parseInt(id) })
            .update({
                sync_type: 3,
            }).then(()=>setProductsData((prevData) => prevData.filter((d) => d.id !== id)))
            
    };

    const onClickProduct = (Name, Price, sku, tax) => {
        setTotal((prev) => prev + Price);

        if (summaryData.length === 0) {
            return setSummaryData([
                ...summaryData,
                {
                    name: Name,
                    price: Price,
                    unit: 1,
                    fixedPrice: Price,
                    discount: 0,
                    sku: sku,
                    tax: tax,
                },
            ]);
        }
        console.log(summaryData, "data");

        const test = summaryData.some((d) => d.name === Name);
        if (test) {
            let data = summaryData.map((obj) =>
                obj.name === Name
                    ? {
                          ...obj,
                          price: (obj.unit + 1) * obj.fixedPrice,
                          unit: obj.unit + 1,
                          fixedPrice: obj.price / obj.unit,
                          sku: sku,
                          tax: tax,
                      }
                    : obj
            );
            setSummaryData(data);
        } else {
            setSummaryData([
                ...summaryData,
                {
                    name: Name,
                    price: Price,
                    unit: +1,
                    fixedPrice: Price,
                    discount: 0,
                    sku: sku,
                    tax: tax,
                },
            ]);
        }
        console.log(summaryData, "test");
    };
    const onSelectSummaryDiv = (i, units, fp) => {
        if (!(i === selectedData)) {
            setNumPadCount("0");
            setPricePad(fp);
            setDiscountPad("0");
        }
        console.log(i, "current");
        setSelectedData(i);
        setCalUnit(units);
    };
    const onCalculatorPress = (num) => {
        if (!calUnit) {
            return alert("Select first");
        }

        console.log(parseInt(numPadCount));
        if (formula === "quantity") {
            console.log("sadsa");
            setNumPadCount(numPadCount + num);
        } else if (formula === "discount") {
            setDiscountPad(discountPad + num);
        } else if (formula === "price") {
            if (summaryData[selectedData].fixedPrice === pricePad) {
                setPricePad(num);
            } else {
                setPricePad(pricePad + num);
            }
        }
    };
    useEffect(() => {
        console.log(value, "searchvalueeeeee");
        // if (!value) {
        //     return setProductsData(db.collection("products")
         //   .get());;
        // }
        const filtered = productsData.filter((d) => {
            console.log(d, "titlllllllllllleeeeeeeeeee");
            d.title.toLowerCase().includes(value.toLowerCase());
        });
        setProductsData(filtered);
    }, [value]);
    useEffect(() => {
        if (summaryData.length === 0) {
            return summaryData;
        } else {
            console.log(summaryData, "asds");
            let items = [...summaryData];
            let item = items[selectedData];
            console.log(item.unit, "sad");
            item.fixedPrice = parseFloat(pricePad);
            item.price = item.fixedPrice * item.unit;
            items[selectedData] = item;
            setSummaryData(items);
        }
    }, [pricePad]);
    useEffect(() => {
        if (summaryData.length === 0) {
            return summaryData;
        } else {
            console.log(summaryData, "asds");
            let items = [...summaryData];
            let item = items[selectedData];
            console.log(item.unit, "sad");
            item.discount = parseInt(discountPad);
            item.price =
                item.price - item.price * (parseInt(discountPad) / 100);
            items[selectedData] = item;
            setSummaryData(items);
        }
    }, [discountPad]);
    useEffect(() => {
        if (summaryData.length === 0) {
            return summaryData;
        } else {
            let unit = calUnit;
            console.log(summaryData, "asds");
            let items = [...summaryData];
            let item = items[selectedData];
            console.log(item.unit, "sad");
            item.unit = unit + parseInt(numPadCount);
            item.price = item.unit * item.fixedPrice;
            items[selectedData] = item;
            setSummaryData(items);
        }
    }, [numPadCount]);

    const onBackSpace = () => {
        if (selectedData === -1) {
            return setSummaryData(summaryData);
        }

        setFormula("backSpace");
        console.log(
            summaryData.filter((d) => d.id !== selectedData),
            "dataaaaaaa"
        );
        setSummaryData((prevData) =>
            prevData.filter((d, i) => i !== selectedData)
        );
        console.log(summaryData, "sadsadsadasdsa");
    };
    useEffect(() => {
        const value = Number.isNaN(
            summaryData.reduce((a, v) => (a = a + v.price), 0)
        );
        console.log(value, "totalllll");
        if (!value) {
            setTotal(summaryData.reduce((a, v) => (a = a + v.price), 0));
        } else {
            setTotal(0);
        }
    }, [summaryData, onBackSpace]);
    useEffect(() => {
        props.onCartUpdate(summaryData, total);
    }, [summaryData, total]);
    return (
        <div className="pos-content">
            <div className="window">
                <div className="subwindow">
                    <div className="subwindow-container">
                        <div className="subwindow-container-fix screens">
                            <div className="product-screen screen">
                                <div style={{ display: "flex" }}>
                                    <div className="leftpane">
                                        <div className="order-container">
                                            <div className="order">
                                                {/* // {Object.keys(summaryData[0].name).length === 0} */}
                                                {summaryData.length === 0 ? (
                                                    <div></div>
                                                ) : (
                                                    summaryData.map((d, i) => (
                                                        <ul
                                                            className="orderlines"
                                                            onClick={() =>
                                                                onSelectSummaryDiv(
                                                                    i,
                                                                    d.unit,
                                                                    d.fixedPrice
                                                                )
                                                            }
                                                        >
                                                            <li
                                                                className={`orderline ${
                                                                    selectedData ===
                                                                    i
                                                                        ? "selected"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <span className="product-name">
                                                                    {d.name}
                                                                    <span></span>
                                                                </span>
                                                                <span className="price">
                                                                    {d.price}
                                                                </span>
                                                                <ul className="info-list">
                                                                    <li className="info">
                                                                        <em>
                                                                            {
                                                                                d.unit
                                                                            }{" "}
                                                                        </em>
                                                                        <span></span>
                                                                        Units at
                                                                        Rs{" "}
                                                                        {
                                                                            d.fixedPrice
                                                                        }{" "}
                                                                        / Units
                                                                    </li>
                                                                    <li className="info">
                                                                        With a
                                                                        <em>
                                                                            {" "}
                                                                            {
                                                                                d.discount
                                                                            }
                                                                            %{" "}
                                                                        </em>
                                                                        discount
                                                                    </li>
                                                                </ul>
                                                            </li>
                                                        </ul>
                                                    ))
                                                )}
                                                <div className="summary clearfix">
                                                    <div className="line">
                                                        <div className="entry total">
                                                            <span className="totalStyling">
                                                                Total:
                                                            </span>
                                                            <span className="value">
                                                                Rs {total}
                                                            </span>
                                                            <div className="subentry">
                                                                Taxes:
                                                                <span className="value">
                                                                    Rs 0.00
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pads">
                                            <div className="control-buttons"></div>
                                            <div className="subpads">
                                                <div className="actionpad">
                                                    <button
                                                        className="button set-customer"
                                                        onClick={() =>
                                                            History.push(
                                                                "/Customer"
                                                            )
                                                        }
                                                    >
                                                        <FaUser
                                                            title="Customer"
                                                            className="fa fa-user"
                                                        />
                                                        {props.customer
                                                            .first_name ||
                                                            "Customer"}
                                                    </button>
                                                    <button
                                                        className="button pay"
                                                        onClick={() =>
                                                            History.push(
                                                                "/payment"
                                                            )
                                                        }
                                                    >
                                                        <div className="pay-circle">
                                                            <FaChevronRight
                                                                title="Pay"
                                                                className="fa fa-chevron-right"
                                                            />
                                                        </div>
                                                        Payment
                                                    </button>
                                                </div>
                                                <div className="numpad">
                                                    <button
                                                        className="input-button number-char"
                                                        onClick={() =>
                                                            onCalculatorPress(
                                                                "1"
                                                            )
                                                        }
                                                    >
                                                        1
                                                    </button>
                                                    <button
                                                        className="input-button number-char"
                                                        onClick={() =>
                                                            onCalculatorPress(
                                                                "2"
                                                            )
                                                        }
                                                    >
                                                        2
                                                    </button>
                                                    <button
                                                        className="input-button number-char"
                                                        onClick={() =>
                                                            onCalculatorPress(
                                                                "3"
                                                            )
                                                        }
                                                    >
                                                        3
                                                    </button>
                                                    <button
                                                        className={`mode-button ${
                                                            formula ===
                                                            "quantity"
                                                                ? "selected-mode"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            setFormula(
                                                                "quantity"
                                                            )
                                                        }
                                                    >
                                                        Qty
                                                    </button>
                                                    <br />
                                                    <button
                                                        className="input-button number-char"
                                                        onClick={() =>
                                                            onCalculatorPress(
                                                                "4"
                                                            )
                                                        }
                                                    >
                                                        4
                                                    </button>
                                                    <button
                                                        className="input-button number-char"
                                                        onClick={() =>
                                                            onCalculatorPress(
                                                                "5"
                                                            )
                                                        }
                                                    >
                                                        5
                                                    </button>
                                                    <button
                                                        className="input-button number-char"
                                                        onClick={() =>
                                                            onCalculatorPress(
                                                                "6"
                                                            )
                                                        }
                                                    >
                                                        6
                                                    </button>
                                                    <button
                                                        className={`mode-button ${
                                                            formula ===
                                                            "discount"
                                                                ? "selected-mode"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            setFormula(
                                                                "discount"
                                                            )
                                                        }
                                                    >
                                                        Disc
                                                    </button>
                                                    <br />
                                                    <button
                                                        className="input-button number-char"
                                                        onClick={() =>
                                                            onCalculatorPress(
                                                                "7"
                                                            )
                                                        }
                                                    >
                                                        7
                                                    </button>
                                                    <button
                                                        className="input-button number-char"
                                                        onClick={() =>
                                                            onCalculatorPress(
                                                                "8"
                                                            )
                                                        }
                                                    >
                                                        8
                                                    </button>
                                                    <button
                                                        className="input-button number-char"
                                                        onClick={() =>
                                                            onCalculatorPress(
                                                                "9"
                                                            )
                                                        }
                                                    >
                                                        9
                                                    </button>
                                                    <button
                                                        className={`mode-button ${
                                                            formula === "price"
                                                                ? "selected-mode"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            setFormula("price")
                                                        }
                                                    >
                                                        Price
                                                    </button>
                                                    <br />
                                                    <button className="input-button numpad-minus">
                                                        +/-
                                                    </button>
                                                    <button
                                                        className="input-button number-char"
                                                        onClick={() =>
                                                            onCalculatorPress(
                                                                "0"
                                                            )
                                                        }
                                                    >
                                                        0
                                                    </button>
                                                    <button className="input-button number-char">
                                                        .
                                                    </button>
                                                    <button
                                                        className={`mode-button numpad-backspace${
                                                            formula ===
                                                            "backSpace"
                                                                ? " selected-mode"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            onBackSpace()
                                                        }
                                                    >
                                                        <FaBackspace
                                                            style={{
                                                                width: 24,
                                                                height: 21,
                                                            }}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rightpane">
                                        <div className="products-widget">
                                            <div className="products-widget-control">
                                                <div className="rightpane-header green-border-bottom">
                                                    <div className="breadcrumbs">
                                                        <span className="breadcrumb">
                                                            <span className="breadcrumb-button breadcrumb-home">
                                                                <FaHome
                                                                    title="Home"
                                                                    className="fa fa-home"
                                                                />
                                                            </span>
                                                        </span>
                                                    </div>
                                                    {categories.length > 0
                                                        ? categories.map(
                                                              (d) => (
                                                                  <span className="category-simple-button">
                                                                      {d.name}
                                                                  </span>
                                                              )
                                                          )
                                                        : ""}

                                                    <span
                                                        className="category-simple-button"
                                                        onClick={() =>
                                                            History.push(
                                                                "/AddProduct"
                                                            )
                                                        }
                                                    >
                                                        Add Product
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="product-list-container">
                                                <div className="product-image">
                                                    {productsData.map((d) => (
                                                        <div className="product-wrapper">
                                                            <img
                                                                alt=""
                                                                src={
                                                                    productImage
                                                                }
                                                                style={{
                                                                    width: 120,
                                                                    height: 100,
                                                                }}
                                                                onClick={() =>
                                                                    onClickProduct(
                                                                        d.title,
                                                                        d.price,
                                                                        d.sku,
                                                                        d.tax
                                                                    )
                                                                }
                                                            ></img>

                                                            <p className="price-tag">
                                                                Rs{d.price}
                                                                /Units
                                                            </p>
                                                            <p
                                                                style={{
                                                                    margin: 0,
                                                                }}
                                                            >
                                                                {d.title}
                                                            </p>
                                                            <div className="flex">
                                                                <FaEdit
                                                                    onClick={() =>
                                                                        onEditProduct(
                                                                            d.id
                                                                        )
                                                                    }
                                                                />
                                                                <FaTrashAlt
                                                                    onClick={() =>
                                                                        onDeleteProduct(
                                                                            d.id
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
const mapStateToProps = (state) => {
    return {
        token: state.srch.token,
        value: state.srch.searchValue,
        customer: state.srch.customer,
    };
};

const mapDispatchToProps = (dispatch) => ({
    onCartUpdate: (value, price) => dispatch(cartUpdate(value, price)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PosPage);
