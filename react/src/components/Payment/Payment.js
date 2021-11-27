import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import {
    FaAngleDoubleRight,
    FaPrint,
    FaRegEnvelope,
    FaSearch,
} from "react-icons/fa";
import Localbase from "localbase";
import Logo from "../../Assets/img/logo.png";
import History from "../../Navigation/History";
import "../../Assets/style/style.scss";
import ReactToPrint from "react-to-print";
import { Col, Container, Row } from "react-bootstrap";
import Menu from "../Menu/Menu";

function Payment(props) {
    let db = new Localbase("db");
    const [mounted, setMounted] = useState(false);
    const [userdata, setUserData] = useState([]);
    const [lastId, setLastId] = useState();

    if (!mounted) {
        db.collection("orders")
            .orderBy("id", "desc")
            .get()
            .then((data) => {
                data.length > 0 ? setLastId(data[0].id) : setLastId(1);
            });

        db.collection("user")
            .get()
            .then((usersdb) => {
                // console.log(usersdb, "usrssss");
                setUserData(usersdb);
            });
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    console.log(userdata, "ysersssss");
    const onOrderSuccess = () => {
        db.collection("orders")
            .add({
                id: lastId + 1,
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
                invoice_country_name: "Pakistan",
                currency_code: "rs",
                currency_name: "Rupees",
                payment_method_code: "100",
                payment_method_name: "cash",
                shipping_method_code: "1",
                shipping_method_name: "DHL",
                purchase_date: new Date(),
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
            .then(History.push("/"));
    };

    const componentRef = useRef();
    return (
        <Container fluid>
            <Row>
                <Menu />
                <Col xs="11" className="all-wrapper">
                    <Container fluid>
                        <div className="main-conatiner">
                            <div className="title-wrap">
                                <h1 className="Title">Payments</h1>
                                <div className="search-box">
                                    <input
                                        type="search"
                                        placeholder="Search Orders..."
                                    />
                                    <span className="icon">
                                        <FaSearch
                                            className="fa"
                                            aria-hidden="true"
                                        />
                                    </span>
                                </div>
                            </div>
                            <div className="screen-content">
                                <div className="top-content">
                                    <div className="content-center">
                                        <h1 className="Top-text">
                                            Rs{" "}
                                            {parseFloat(props.total).toFixed(
                                                2
                                            ) || 0}
                                        </h1>
                                    </div>
                                    <div
                                        className="buttonss"
                                        onClick={() => History.push("/")}
                                    >
                                        New Order <FaAngleDoubleRight />
                                    </div>
                                </div>
                                <div className="default-view">
                                    <div
                                        className="pos-receipt-container"
                                        ref={componentRef}
                                    >
                                        <div className="pos-receipt">
                                            <img
                                                src={Logo}
                                                className="pos-receipt-logo"
                                                alt=""
                                            />
                                            <br />
                                            <div className="pos-receipt-contact">
                                                <div className="textstyle">
                                                    sudosol
                                                </div>
                                                <div className="textstyle">
                                                    {userdata.length > 0
                                                        ? userdata[0].email
                                                        : "Email"}
                                                </div>
                                                <div className="cashier">
                                                    <div>
                                                        --------------------------------
                                                    </div>
                                                    <div className="textstyle">
                                                        Served by
                                                        {userdata.length > 0
                                                            ? userdata[0]
                                                                  .first_name
                                                            : "name"}
                                                    </div>
                                                </div>
                                            </div>
                                            <br />
                                            <br />
                                            {props.cart
                                                ? props.cart.map((d) => (
                                                      <div>
                                                          <div className="textstyles">
                                                              {d.name}
                                                              <span
                                                                  style={{
                                                                      float: "right",
                                                                  }}
                                                              >
                                                                  {parseFloat(
                                                                      d.price
                                                                  ).toFixed(2)}
                                                              </span>
                                                          </div>
                                                          <span></span>
                                                      </div>
                                                  ))
                                                : ""}
                                            <div style={{ float: "right" }}>
                                                --------
                                            </div>
                                            <br />
                                            <div>
                                                <div className="textstyles">
                                                    Sub Total
                                                    <span
                                                        style={{
                                                            float: "right",
                                                        }}
                                                    >
                                                        Rs{" "}
                                                        {parseFloat(
                                                            props.total
                                                        ).toFixed(2) || 0}
                                                    </span>
                                                </div>

                                                <span></span>
                                            </div>
                                            <div style={{ float: "right" }}>
                                                --------
                                            </div>
                                            <br />
                                            <div className="total-wrap">
                                                TOTAL
                                                <span>
                                                    Rs{" "}
                                                    {parseFloat(
                                                        props.total
                                                    ).toFixed(2) || 0}
                                                </span>
                                            </div>
                                            <br />
                                            <br />
                                            <div>
                                                <div className="textstyles">
                                                    Cash
                                                    <span
                                                        style={{
                                                            float: "right",
                                                        }}
                                                    >
                                                        0
                                                    </span>
                                                </div>
                                                <span></span>
                                            </div>

                                            <div className="total-wrap">
                                                CHANGE
                                                <span>0</span>
                                            </div>
                                            <br />
                                            <div className="pos-receipt-contact">
                                                <div className="textstyle">
                                                    Order 00001-067-0009
                                                </div>
                                                <div className="textstyle">
                                                    {new Date().toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="actions">
                                        <h1>
                                            How would you like to receive your
                                            receipt?
                                        </h1>
                                        <ReactToPrint
                                            trigger={() => (
                                                <div className="buttons">
                                                    <button className="button print">
                                                        <FaPrint /> Print
                                                        Receipt
                                                    </button>
                                                </div>
                                            )}
                                            content={() => componentRef.current}
                                        />

                                        <form className="send-email">
                                            <div className="email-icons">
                                                <FaRegEnvelope />
                                            </div>
                                            <div className="input-email">
                                                <input
                                                    placeholder="Email Receipt"
                                                    type="email"
                                                />
                                                <button
                                                    type="submit"
                                                    className="send"
                                                >
                                                    Send
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}
const mapStateToProps = (state) => {
    return {
        value: state.srch.token,
        cash: state.srch.cash,
        productsData: state.srch.cartData,
        customer: state.srch.customer,
        change: state.srch.change,
        cart: state.srch.cartData,
        total: state.srch.total,
    };
};
export default connect(mapStateToProps)(Payment);
