import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
    FaSearch,
    FaUser,
    FaPlus,
    FaMinus,
    FaCartPlus,
    FaAngleLeft,
    FaAngleRight,
    FaCartArrowDown,
} from "react-icons/fa";
import ItemsCarousel from "react-items-carousel";
import Sidebar from "react-sidebar";
import "../../Assets/style/style.scss";
import { connect } from "react-redux";
import Localbase from "localbase";
import { cartUpdate, setCustomer } from "../../store/actions";
import Menu from "../Menu/Menu";
import { FaGlassCheers } from "react-icons/fa";
import Category from "../UIComponents/Category/Category";
import Product from "../UIComponents/Product/Product";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import product from "../../Assets/img/cafe.jpg";
import Sidebars from "../UIComponents/Sidebar/Sidebar";
import Payment from "../UIComponents/payment/Payment";
import History from "../../Navigation/History";
import MiniCart from "../UIComponents/MiniCart/MiniCart";

function getWindowDimensions() {
    const { outerWidth: width, outerHeight: height } = window;
    return {
        width,
        height,
    };
}

const SalesDashboard = (props) => {
    let db = new Localbase("db");
    const [selectedData, setSelectedData] = useState(-1);
    const [mounted, SetMounted] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [summaryData, setSummaryData] = useState([]);
    const [subtotal, setSubTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [taxPrice, setTaxPrice] = useState(0);
    const [total, setTotal] = useState(0);
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [barcodeInputValue, SetBarcodeInputValue] = useState("");
    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    );

    const openMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const openSideMenu = () => {
        setShowMenu(!showMenu);
    };

    if (!mounted) {
        db.collection("products")
            .get()
            .then((d) => {
                console.log(d);
                setProducts(d);
            });

        db.collection("categories")
            .get()
            .then((d) => {
                console.log(d);
                setCategories(d);
            });
    }

    useEffect(() => {
        console.log(categories, "acaascacacaca");
    }, [categories]);

    useEffect(() => {
        SetMounted(true);
    }, []);
    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    console.log(categories, "categoriess");

    function onChangeBarcode(event) {
        SetBarcodeInputValue(event.target.value);
    }

    function onKeyPressBarcode(event) {
        if (event.keyCode === 13) {
            SetBarcodeInputValue(event.target.value);
            const filtered = products.filter(
                (d) => d.barcode === barcodeInputValue
            );
            console.log(filtered, "filtereddd");
            if (filtered.length > 0) {
                onClickProduct(
                    filtered[0].id,
                    filtered[0].title,
                    filtered[0].price,
                    filtered[0].sku,
                    filtered[0].tax,
                    filtered[0].profile
                );
            } else if (filtered.length === 0) {
                alert("Product not found");
            }
        }
    }

    const onClickProduct = (Id, Name, Price, sku, tax, profile) => {
        setSubTotal((prev) => Number(prev) + Number(Price));
        setTax((prev) => Number(prev) + (Number(tax) / Number(Price)) * 100);
        setTaxPrice((prev) => Number(prev) + Number(tax));
        setTotal((prev) => Number(prev) + (Number(tax) + Number(Price)));

        if (summaryData.length === 0) {
            return setSummaryData([
                ...summaryData,
                {
                    id: Id,
                    name: Name,
                    price: Price,
                    unit: 1,
                    fixedPrice: Price,
                    discount: 0,
                    sku: sku,
                    tax: tax,
                    profile: profile,
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
                          profile: profile,
                      }
                    : obj
            );
            setSummaryData(data);
        } else {
            setSummaryData([
                ...summaryData,
                {
                    id: Id,
                    name: Name,
                    price: Price,
                    unit: +1,
                    fixedPrice: Price,
                    discount: 0,
                    sku: sku,
                    tax: tax,
                    profile: profile,
                },
            ]);
        }
        console.log(summaryData, "test");
    };

    useEffect(() => {
        props.onCartUpdate(summaryData, total);
    }, [summaryData, total]);

    const changeActiveItem = (activeItemIndex) =>
        setActiveItemIndex(activeItemIndex);
    const chevronWidth = 40;
    const [categoryId, setCategoryId] = useState();
    const onCategoryChange = async (id, i) => {
        if (selectedData === i) {
            setSelectedData(-1);
        } else {
            setSelectedData(i);
        }
        if (categoryId === id) {
            setCategoryId(categoryId);
            db.collection("products")
                .get()
                .then((d) => {
                    console.log(d);
                    setProducts(d);
                });
        } else {
            setCategoryId(id);
            console.log(id, "iddddddddd");
            let pro;
            await db
                .collection("products")
                .get()
                .then((p) => (pro = p));
            console.log(pro);
            const filtered = pro.filter((d) => {
                console.log(d, "dddddddddd");
                return parseInt(d.category_id, 10) === id;
            });
            console.log(filtered, "filtered");
            setProducts(filtered);
        }
    };
    const onOrderSuccess = async () => {
        if (summaryData.length === 0) {
            alert("Please select Product");
        } else {
            let orderId = 0;
            await db
                .collection("orders")
                .orderBy("id", "desc")
                .get()
                .then((data) => {
                    data.length > 0 ? (orderId = data[0].id) : (orderId = 1);
                });
            db.collection("orders")
                .add({
                    id: orderId + 1,
                    external_order_identifier: "699",
                    customer_id: props.customer.id || null,
                    core_account_id: "1",
                    language_code: 1,
                    state_code: "processing",
                    state_name: "Processing",
                    status_code: "completed",
                    status_name: "Completed",
                    customer_title: "Mr",
                    customer_firstname: props.customer.first_name || null,
                    customer_lastname: props.customer.last_name || null,
                    customer_company: props.customer
                        ? props.customer.address.company
                        : null,
                    customer_email: props.customer.last_name || null,
                    customer_phone: props.customer
                        ? props.customer.address.phone_number
                        : null,
                    customer_street_1: props.customer
                        ? props.customer.address.street_line_1
                        : null,
                    customer_street_2: props.customer
                        ? props.customer.address.street_line_2
                        : null,
                    customer_postcode: props.customer
                        ? props.customer.address.postal_code
                        : null,
                    customer_city: props.customer
                        ? props.customer.address.city
                        : null,
                    customer_country_code: "201",
                    customer_country_name: "Pakistan",
                    shipping_title: "Mr",
                    shipping_firstname: props.customer.first_name || null,
                    shipping_lastname: props.customer.last_name || null,
                    shipping_company: props.customer
                        ? props.customer.address.company
                        : null,
                    shipping_street_1: props.customer
                        ? props.customer.address.street_line_1
                        : null,
                    shipping_street_2: props.customer
                        ? props.customer.address.street_line_2
                        : null,
                    shipping_postcode: props.customer
                        ? props.customer.address.postal_code
                        : null,
                    shipping_city: props.customer
                        ? props.customer.address.city
                        : null,
                    shipping_country_code: "201",
                    shipping_country_name: "Pakistan",
                    invoice_title: "Mr",
                    invoice_firstname: props.customer.first_name || null,
                    invoice_lastname: props.customer.last_name || null,
                    invoice_company: props.customer
                        ? props.customer.address.company
                        : null,
                    invoice_street_1: props.customer
                        ? props.customer.address.street_line_1
                        : null,
                    invoice_street_2: props.customer
                        ? props.customer.address.street_line_2
                        : null,
                    invoice_postcode: props.customer
                        ? props.customer.address.postal_code
                        : null,
                    invoice_city: props.customer
                        ? props.customer.address.city
                        : null,
                    invoice_country_code: "201",
                    invoice_number: Math.random().toString(36).substr(2, 9),
                    invoice_country_name: "Pakistan",
                    currency_code: "rs",
                    currency_name: "Rupees",
                    payment_method_code: "100",
                    payment_method_name: "cash",
                    shipping_method_code: "1",
                    shipping_method_name: "DHL",
                    purchase_date: new Date().toLocaleString(),
                    external_purchase_date: new Date().toString(),
                    marketplace_code: 2,
                    marketplace_name: "magento",
                    marketplace_group_code: "345",
                    marketplace_group_name: "deldo",
                    account_code: "2",
                    account_name: "cash",
                    external_customer_identifier: 1,
                    seller_order_identifier: "1",
                    custom_field_1: null,
                    custom_field_2: null,
                    custom_field_3: null,
                    custom_field_4: null,
                    custom_field_5: null,
                    core_seller_id: "1",
                    core_user_id: "1",
                    core_marketplace_code: "default",
                    core_marketplace_name: "default",
                    core_marketplace_group_code: "",
                    core_marketplace_group_name: "",
                    core_order_products:
                        props.productsData.map((d) => {
                            return {
                                id: d.id,
                                sku: d.sku,
                                type: d.type,
                                name: d.name,
                                single_price: d.fixedPrice,
                                is_price_incl_tax: d.tax,
                                tax_percent: d.tax,
                                quantity: d.unit,
                                external_identifier: "123",
                                marketplace_product_identifier: "335",
                                external_fee_amount: 0,
                                options: null,
                            };
                        }) || null,
                    sync: 0,
                    sync_type: 1,
                })
                .then(History.push("/payment"));
        }
    };
    const onAdd = (index) => {
        console.log(summaryData[index], "sumaryData[i]");
        let data = [...summaryData];
        let item = data[index];
        item.unit = item.unit + 1;
        item.price = Number(item.price) + Number(item.fixedPrice);
        data[index] = item;
        setSummaryData(data);
    };
    const onMinus = (index) => {
        if (summaryData[index].unit === 1) {
            setSummaryData((prevData) =>
                prevData.filter((d, i) => i !== index)
            );
        } else {
            let data = [...summaryData];
            let item = data[index];
            item.unit = item.unit - 1;
            item.price = item.price - item.fixedPrice;
            data[index] = item;
            setSummaryData(data);
        }
    };

    const onDeleteCart = (index) => {
        setSummaryData((prevData) => prevData.filter((d, i) => i !== index));
    };
    const onProductSearch = async (e) => {
        if (!e.target.value) {
            return db
                .collection("products")
                .get()
                .then((d) => setProducts(d));
        }
        let data;
        await db
            .collection("products")
            .get()
            .then((d) => (data = d));
        const filtered = data.filter((p) =>
            p.title.toLowerCase().includes(e.target.value.toLowerCase())
        );
        console.log(filtered, "dddddfffff");
        setProducts(filtered);
    };
    console.log(windowDimensions, "windowDimensionsss");
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
    }, [summaryData]);
    let sw;
    if (windowDimensions.width <= 470) {
        categories.length > 3 ? (sw = 3) : (sw = categories.length);
    } else if (windowDimensions.width <= 700) {
        categories.length > 4 ? (sw = 4) : (sw = categories.length);
    } else if (windowDimensions.width <= 1000) {
        categories.length > 5 ? (sw = 5) : (sw = categories.length);
    } else if (windowDimensions.width <= 1200) {
        categories.length > 6 ? (sw = 6) : (sw = categories.length);
    } else {
        categories.length > 8 ? (sw = 8) : (sw = categories.length);
    }
    console.log(sw, "swwwwwwwwww");
    return (
        <Container fluid>
            <Row>
                <Menu />
                <Col xs="11">
                    <Container fluid>
                        <Row>
                            <Col xs="9" className="showbtn">
                                <div className="title-wrap">
                                    <h1 className="Title">Choose Category</h1>
                                    <div className="search-box">
                                        <input
                                            autoFocus={true}
                                            placeholder="Start Scanning"
                                            value={barcodeInputValue}
                                            onChange={onChangeBarcode}
                                            id="SearchbyScanning"
                                            type="search"
                                            onKeyDown={onKeyPressBarcode}
                                            // onBlur={barcodeAutoFocus}
                                        />
                                        <input
                                            type="search"
                                            onChange={(e) => onProductSearch(e)}
                                            placeholder="Search Products..."
                                        />
                                        <span className="icon">
                                            <FaSearch
                                                className="fa"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </div>
                                </div>

                                <div className="Category-wrapper">
                                    <ItemsCarousel
                                        // Placeholder configurations
                                        enablePlaceholder
                                        numberOfPlaceholderItems={sw}
                                        minimumPlaceholderTime={10}
                                        placeholderItem={
                                            <div
                                                style={{
                                                    height: 200,
                                                    background: "#900",
                                                }}
                                            >
                                                Placeholder
                                            </div>
                                        }
                                        // Carousel configurations
                                        numberOfCards={sw}
                                        gutter={2}
                                        showSlither
                                        firstAndLastGutter={false}
                                        freeScrolling={false}
                                        // Active item configurations
                                        requestToChangeActive={changeActiveItem}
                                        activeItemIndex={activeItemIndex}
                                        activePosition="center"
                                        outsideChevron={true}
                                        chevronWidth={0}
                                        rightChevron={
                                            <div>
                                                {
                                                    <FaAngleRight
                                                        style={{
                                                            color: "#704232",
                                                            height: 25,
                                                        }}
                                                    />
                                                }
                                            </div>
                                        }
                                        leftChevron={
                                            <div>
                                                {
                                                    <FaAngleLeft
                                                        style={{
                                                            color: "#704232",
                                                            height: 25,
                                                        }}
                                                    />
                                                }
                                            </div>
                                        }
                                        outsideChevron={true}
                                    >
                                        {categories.map((d, i) => (
                                            <div
                                                className="category-style"
                                                onClick={() =>
                                                    onCategoryChange(d.id, i)
                                                }
                                            >
                                                <Category
                                                    index={i}
                                                    selectedData={selectedData}
                                                    id={d.id}
                                                    title={d.name}
                                                    image={<FaGlassCheers />}
                                                />
                                            </div>
                                        ))}
                                    </ItemsCarousel>
                                </div>

                                <div className="products-top">
                                    <div className="menu-name">Products</div>
                                    <div className="menu-items">
                                        {products.length} result
                                    </div>
                                </div>
                                <div className="products-wrap showbtn">
                                    {products.map((p) => (
                                        <Product
                                            image={p.profile}
                                            title={p.title}
                                            price={p.price}
                                            description={p.description}
                                            onClick={() => {
                                                onClickProduct(
                                                    p.id,
                                                    p.title,
                                                    p.price,
                                                    p.sku,
                                                    p.tax,
                                                    p.profile
                                                );
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="products-wrap hiddenbtn">
                                    {products.map((p) => (
                                        <Product
                                            image={product}
                                            title={p.title}
                                            price={p.price}
                                            description={p.description}
                                            onClick={() => {
                                                onClickProduct(
                                                    p.id,
                                                    p.title,
                                                    p.price,
                                                    p.sku,
                                                    p.tax
                                                );
                                            }}
                                        />
                                    ))}
                                </div>
                            </Col>
                            <Col xs="12" className="hiddenbtn">
                                <div className="title-wrap">
                                    <h1 className="Title">Choose Category</h1>
                                    <div className="search-box">
                                        <input
                                            type="search"
                                            placeholder="Search Products..."
                                        />
                                        <span className="icon">
                                            <FaSearch
                                                className="fa"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </div>
                                    <MiniCart
                                        onClick={() => openSideMenu()}
                                        value={summaryData.length}
                                    />
                                </div>
                                <div className="Category-wrapper">
                                    <ItemsCarousel
                                        // Placeholder configurations
                                        enablePlaceholder
                                        numberOfPlaceholderItems={sw}
                                        minimumPlaceholderTime={10}
                                        placeholderItem={
                                            <div
                                                style={{
                                                    height: 200,
                                                    background: "#900",
                                                }}
                                            >
                                                Placeholder
                                            </div>
                                        }
                                        // Carousel configurations
                                        numberOfCards={sw}
                                        gutter={2}
                                        showSlither
                                        firstAndLastGutter={false}
                                        freeScrolling={false}
                                        // Active item configurations
                                        requestToChangeActive={changeActiveItem}
                                        activeItemIndex={activeItemIndex}
                                        activePosition="center"
                                        outsideChevron={true}
                                        chevronWidth={0}
                                        rightChevron={
                                            <div>
                                                {
                                                    <FaAngleRight
                                                        style={{
                                                            color: "#704232",
                                                            height: 25,
                                                        }}
                                                    />
                                                }
                                            </div>
                                        }
                                        leftChevron={
                                            <div>
                                                {
                                                    <FaAngleLeft
                                                        style={{
                                                            color: "#704232",
                                                            height: 25,
                                                        }}
                                                    />
                                                }
                                            </div>
                                        }
                                    >
                                        {categories.map((d, i) => (
                                            <div
                                                className="category-style"
                                                onClick={() =>
                                                    onCategoryChange(d.id, i)
                                                }
                                            >
                                                <Category
                                                    index={i}
                                                    selectedData={selectedData}
                                                    id={d.id}
                                                    title={d.name}
                                                    image={<FaGlassCheers />}
                                                />
                                            </div>
                                        ))}
                                    </ItemsCarousel>
                                </div>

                                <div className="Category-wrapper"></div>
                                <div className="products-top">
                                    <div className="menu-name">Products</div>
                                    <div className="menu-items">
                                        {products.length} Result
                                    </div>
                                </div>
                                <div className="products-wrap showbtn">
                                    {products.map((p) => (
                                        <Product
                                            image={product}
                                            title={p.title}
                                            price={p.price}
                                            description={p.description}
                                            onClick={() => {
                                                onClickProduct(
                                                    p.id,
                                                    p.title,
                                                    p.price,
                                                    p.sku,
                                                    p.tax
                                                );
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="products-wrap hiddenbtn">
                                    {products.map((p) => (
                                        <Product
                                            image={p.profile}
                                            title={p.title}
                                            price={p.price}
                                            description={p.description}
                                            onClick={() => {
                                                onClickProduct(
                                                    p.id,
                                                    p.title,
                                                    p.price,
                                                    p.sku,
                                                    p.tax,
                                                    p.profile
                                                );
                                            }}
                                        />
                                    ))}
                                </div>
                                {showMenu ? (
                                    <div className="side-cart hover-menu hidden-menu">
                                        <div className="side-cart-wrap">
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <h4 className="side-top">
                                                    Bills
                                                </h4>
                                                <h4
                                                    className="side-top"
                                                    onClick={() =>
                                                        openSideMenu()
                                                    }
                                                >
                                                    &#10006;
                                                </h4>
                                            </div>
                                            <Row>
                                                <div>
                                                    <div className="cartHeight">
                                                        {summaryData.length ===
                                                        0 ? (
                                                            <div></div>
                                                        ) : (
                                                            summaryData.map(
                                                                (d, i) => (
                                                                    <Sidebars
                                                                        title={
                                                                            d.name
                                                                        }
                                                                        quantity={
                                                                            d.unit
                                                                        }
                                                                        image={
                                                                            d.profile
                                                                        }
                                                                        price={
                                                                            d.price
                                                                        }
                                                                        imagePlus={
                                                                            <FaPlus />
                                                                        }
                                                                        imageMinus={
                                                                            <FaMinus />
                                                                        }
                                                                        onClickPlus={() =>
                                                                            onAdd(
                                                                                i
                                                                            )
                                                                        }
                                                                        onClickMinus={() =>
                                                                            onMinus(
                                                                                i
                                                                            )
                                                                        }
                                                                        onDelete={() =>
                                                                            onDeleteCart(
                                                                                i
                                                                            )
                                                                        }
                                                                    />
                                                                )
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </Row>
                                            <Row>
                                                <Col xs="12">
                                                    <div className="tax-wrap"></div>

                                                    <div className="total-wrap">
                                                        <div>Total</div>
                                                        <div>
                                                            <sup>Rs</sup>{" "}
                                                            {parseInt(total)}
                                                        </div>
                                                    </div>

                                                    <div className="payment-wrap">
                                                        <h4 className="payment-text">
                                                            Set Customer
                                                        </h4>
                                                        <div className="payment-card-wrap">
                                                            <Payment
                                                                className="category-style"
                                                                title={
                                                                    props
                                                                        .customer
                                                                        .first_name ||
                                                                    "Customer"
                                                                }
                                                                onClick={() =>
                                                                    History.push(
                                                                        "/Customer"
                                                                    )
                                                                }
                                                                image={
                                                                    <FaUser />
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="payment-button"
                                                        onClick={() =>
                                                            onOrderSuccess()
                                                        }
                                                    >
                                                        Print Bills
                                                    </button>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </Col>
                            <Col xs="3" className="side-cart showbtn">
                                <div className="side-cart-wrap">
                                    <h4 className="side-top">Bills</h4>
                                    <Row>
                                        <Col xs="12">
                                            <div className="cartHeight">
                                                {summaryData.length === 0 ? (
                                                    <div></div>
                                                ) : (
                                                    summaryData.map((d, i) => (
                                                        <Sidebars
                                                            title={d.name}
                                                            quantity={d.unit}
                                                            image={d.profile}
                                                            price={d.price}
                                                            imagePlus={
                                                                <FaPlus />
                                                            }
                                                            imageMinus={
                                                                <FaMinus />
                                                            }
                                                            onClickPlus={() =>
                                                                onAdd(i)
                                                            }
                                                            onClickMinus={() =>
                                                                onMinus(i)
                                                            }
                                                            onDelete={() =>
                                                                onDeleteCart(i)
                                                            }
                                                        />
                                                    ))
                                                )}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12">
                                            <div className="tax-wrap"></div>

                                            <div className="total-wrap">
                                                <div>Total</div>
                                                <div>
                                                    <sup>Rs</sup>{" "}
                                                    {parseInt(total)}
                                                </div>
                                            </div>

                                            <div className="payment-wrap">
                                                <h4 className="payment-text">
                                                    Set Customer
                                                </h4>
                                                <div className="payment-card-wrap">
                                                    <Payment
                                                        className="category-style"
                                                        title={
                                                            props.customer
                                                                .first_name ||
                                                            "Customer"
                                                        }
                                                        onClick={() =>
                                                            History.push(
                                                                "/Customer"
                                                            )
                                                        }
                                                        image={<FaUser />}
                                                    />
                                                    <h4
                                                        className="side-top"
                                                        style={{
                                                            marginTop: "25px",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() =>
                                                            props.onSetCustomer(
                                                                []
                                                            )
                                                        }
                                                    >
                                                        &#10006;
                                                    </h4>
                                                </div>
                                            </div>
                                            <button
                                                className="payment-button"
                                                onClick={() => onOrderSuccess()}
                                            >
                                                Print Bills
                                            </button>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};
const mapStateToProps = (state) => {
    return {
        token: state.srch.token,
        value: state.srch.searchValue,
        customer: state.srch.customer,
        total: state.srch.total,
        change: state.srch.change,
        productsData: state.srch.cartData,
        cart: state.srch.cartData,
    };
};

const mapDispatchToProps = (dispatch) => ({
    onCartUpdate: (value, price) => dispatch(cartUpdate(value, price)),
    onSetCustomer: (value) => dispatch(setCustomer(value)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SalesDashboard);
