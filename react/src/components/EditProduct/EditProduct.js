import React, { useState, useEffect } from "react";
import "../../Assets/style/style.scss";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Localbase from "localbase";
import { Form, Table, Tabs, Tab, Container, Row, Col } from "react-bootstrap";
import AvatarProvider from "../UIComponents/AvatarProvider/AvatarProvider";
import Selector from "../UIComponents/Selector/Selector";
import History from "../../Navigation/History";
import Menu from "../Menu/Menu";

const EditProduct = () => {
    let { id } = useParams();
    let db = new Localbase("db");
    const [titleVal, setTitleVal] = useState("");
    const [mounted, setMounted] = useState(false);
    const [priceVal, setPriceVal] = useState("");
    const [barVal, setBarVal] = useState("");
    const [taxVal, setTaxVal] = useState("");
    const [descVal, setDescVal] = useState("");
    const [wholeSaleVal, setWholeSaleVal] = useState("");
    const [skuVal, setSkuVal] = useState("");
    const [quantityVal, setQuantityVal] = useState("");
    const [key, setKey] = useState("General Information");
    const [category, setCategory] = useState([]);
    const [categoryChange, setCategoryChange] = useState();
    const [pImage, setPimage] = useState("");

    if (!mounted) {
        db.collection("categories")
            .get()
            .then((data) => {
                setCategory([
                    ...data.map((d) => ({
                        id: d.id,
                        value: d.name,
                    })),
                ]);
            })
            .then(() => {
                category.length > 0
                    ? setCategoryChange(category[0].id)
                    : setCategoryChange(1);
            });
        db.collection("products")
            .doc({ id: parseInt(id) })
            .get()
            .then((products) => {
                console.log(products, "productss");
                setCategoryChange(products.category_id);
                setDescVal(products.description);
                setPriceVal(products.price);
                setWholeSaleVal(products.wholesale_price);
                setTitleVal(products.title);
                setSkuVal(products.sku);
                setBarVal(products.barcode);
                setTaxVal(products.tax);
                setQuantityVal(products.quantity);
                setPimage(products.profile);
            });
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    const imageHandler = (e) => {
        const FR = new FileReader();
        const file = e.target.files[0];

        FR.addEventListener("load", (event) => {
            console.log("logoImage", event.target.result);
            setPimage(event.target.result);
        });

        console.log("logoImage2", file);

        FR.readAsDataURL(file);
    };

    const onInputChange = (e, stateName) => {
        stateName(e.target.value);
    };

    const handleChange = (value, stateName) => {
        stateName(value);
    };

    const EditProducts = async () => {
        let response = await db
            .collection("products")
            .doc({ id: parseInt(id) })
            .update({
                core_account_id: "1",
                core_marketplace_id: "1",
                core_product_type_id: "1",
                category_id: categoryChange,
                core_product_eav_attribute_set_id: "1",
                parent_id: "",
                sku: skuVal,
                title: titleVal,
                price: priceVal,
                description: descVal,
                barcode: barVal,
                tax: taxVal,
                wholesale_price: wholeSaleVal,
                quantity: quantityVal,
                profile: pImage,
                sync: 0,
                sync_type: 2,
            });
        console.log(response, "respnssee");
        if (response.success === true) {
            History.push("/");
        }
    };

    return (
        <Container fluid>
            <Row>
                <Menu />
                <Col xs="11">
                    <Row>
                        <div
                            className="title-wrap"
                            style={{ marginBottom: "15px" }}
                        >
                            <h1 className="Title">Edit product</h1>
                        </div>
                    </Row>
                    <div className="Head-card">
                        <div>
                            <p className="text-wraps">
                                <span className="TopText-1">Products </span>
                                <span className="Top-Text-2"> / </span>
                                <span className="Top-Text-2"> Edit</span>
                            </p>
                            <div>
                                <button
                                    type="button"
                                    className="button1"
                                    onClick={EditProducts}
                                >
                                    SAVE
                                </button>
                                <button
                                    type="button"
                                    className="button2"
                                    onClick={() => History.push("/")}
                                >
                                    DISCARD
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="Main-card">
                        <div className="card-Wrap">
                            <div className="card-content">
                                <Row>
                                    <Col
                                        style={{
                                            marginTop: 20,
                                            paddingRight: 100,
                                        }}
                                        xs="6"
                                    >
                                        <div>
                                            <p className="cardTop-text">
                                                Product Name
                                            </p>
                                            <input
                                                className="product-search"
                                                placeholder="Product Name"
                                                value={titleVal}
                                                onChange={(e) =>
                                                    onInputChange(
                                                        e,
                                                        setTitleVal
                                                    )
                                                }
                                            />
                                        </div>
                                    </Col>
                                    <Col xs="6">
                                        <div style={{ float: "right" }}>
                                            <div>
                                                <AvatarProvider
                                                    barClassName="hide-provider profile-wrap"
                                                    className=" pictureStyle"
                                                    providerImage={pImage}
                                                    onClickChangePhoto={
                                                        imageHandler
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <div className="tabs-Wrap">
                                    <Tabs
                                        defaultActiveKey="profile"
                                        id="uncontrolled-tab-example"
                                        activeKey={key}
                                        onSelect={(k) => setKey(k)}
                                        className="mb-3 "
                                    >
                                        <Tab
                                            eventKey="General Information"
                                            title="General Information"
                                        >
                                            <div className="nav-tabs">
                                                <div className="Table-wrap">
                                                    <Table className="Table-data">
                                                        <tbody>
                                                            <tr
                                                                style={{
                                                                    borderStyle:
                                                                        "hidden",
                                                                }}
                                                            >
                                                                <td className="o_td_label">
                                                                    <label
                                                                        className="o_form_label o_required_modifier"
                                                                        htmlFor="o_field_input_733"
                                                                        data-original-title
                                                                        title
                                                                    >
                                                                        Sku
                                                                    </label>
                                                                </td>
                                                                <td className="td-style">
                                                                    <input
                                                                        className="o_field_char o_field_widget o_input"
                                                                        name="default_code"
                                                                        placeholder
                                                                        type="text"
                                                                        autoComplete="off"
                                                                        if="o_field_input_735"
                                                                        value={
                                                                            skuVal
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            onInputChange(
                                                                                e,
                                                                                setSkuVal
                                                                            )
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                style={{
                                                                    borderStyle:
                                                                        "hidden",
                                                                }}
                                                            >
                                                                <td className="o_td_label">
                                                                    <label
                                                                        className="o_form_label o_required_modifier"
                                                                        htmlFor="o_field_input_733"
                                                                        data-original-title
                                                                        title
                                                                    >
                                                                        Product
                                                                        Category
                                                                    </label>
                                                                </td>
                                                                <td className="td-style">
                                                                    <Selector
                                                                        className="o_input o_field_widget o_required_modifier"
                                                                        options={
                                                                            category
                                                                        }
                                                                        value={
                                                                            categoryChange
                                                                        }
                                                                        onChange={(
                                                                            event
                                                                        ) => {
                                                                            handleChange(
                                                                                event
                                                                                    .target
                                                                                    .value,
                                                                                setCategoryChange
                                                                            );
                                                                        }}
                                                                        required
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                style={{
                                                                    borderStyle:
                                                                        "hidden",
                                                                }}
                                                            >
                                                                <td className="o_td_label">
                                                                    <label
                                                                        className="o_form_label o_required_modifier"
                                                                        htmlFor="o_field_input_733"
                                                                        data-original-title
                                                                        title
                                                                    >
                                                                        Quantity
                                                                    </label>
                                                                </td>
                                                                <td className="td-style">
                                                                    <input
                                                                        className="o_field_char o_field_widget o_input"
                                                                        name="default_code"
                                                                        placeholder
                                                                        type="text"
                                                                        autoComplete="off"
                                                                        if="o_field_input_735"
                                                                        value={
                                                                            quantityVal
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            onInputChange(
                                                                                e,
                                                                                setQuantityVal
                                                                            )
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                style={{
                                                                    borderStyle:
                                                                        "hidden",
                                                                }}
                                                            >
                                                                <td className="o_td_label">
                                                                    <label
                                                                        className="o_form_label o_required_modifier"
                                                                        htmlFor="o_field_input_733"
                                                                        data-original-title
                                                                        title
                                                                    >
                                                                        Barcode
                                                                    </label>
                                                                </td>
                                                                <td className="td-style">
                                                                    <input
                                                                        className="o_field_char o_field_widget o_input"
                                                                        name="default_code"
                                                                        placeholder
                                                                        type="text"
                                                                        autoComplete="off"
                                                                        if="o_field_input_735"
                                                                        maxLength="13"
                                                                        value={
                                                                            barVal
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            onInputChange(
                                                                                e,
                                                                                setBarVal
                                                                            )
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                    <Table className="Table-data">
                                                        <tbody>
                                                            <tr
                                                                style={{
                                                                    borderStyle:
                                                                        "hidden",
                                                                }}
                                                            >
                                                                <td className="">
                                                                    <label
                                                                        className="o_form_label o_required_modifier"
                                                                        htmlFor="o_field_input_733"
                                                                        data-original-title
                                                                        title
                                                                    >
                                                                        Sales
                                                                        Price
                                                                    </label>
                                                                </td>

                                                                <td
                                                                    style={{
                                                                        width: "100%",
                                                                    }}
                                                                >
                                                                    <div name="pricing">
                                                                        <div className="o_field_monetary o_field_number o_input o_field_widget oe_inline">
                                                                            <input
                                                                                className="o_inputs"
                                                                                placeholder
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                value={
                                                                                    priceVal
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    onInputChange(
                                                                                        e,
                                                                                        setPriceVal
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                style={{
                                                                    borderStyle:
                                                                        "hidden",
                                                                }}
                                                            >
                                                                <td className="o_td_label">
                                                                    <label
                                                                        className="o_form_label o_required_modifier"
                                                                        htmlFor="o_field_input_733"
                                                                        data-original-title
                                                                        title
                                                                    >
                                                                        Customer
                                                                        Taxes
                                                                    </label>
                                                                </td>

                                                                <td
                                                                    style={{
                                                                        width: "100%",
                                                                    }}
                                                                >
                                                                    <div name="pricing">
                                                                        <div className="o_field_monetary o_field_number o_input o_field_widget oe_inline">
                                                                            <input
                                                                                className="o_inputs"
                                                                                placeholder
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                value={
                                                                                    taxVal
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    onInputChange(
                                                                                        e,
                                                                                        setTaxVal
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr
                                                                style={{
                                                                    borderStyle:
                                                                        "hidden",
                                                                }}
                                                            >
                                                                <td className="o_td_label">
                                                                    <label
                                                                        className="o_form_label o_required_modifier"
                                                                        htmlFor="o_field_input_733"
                                                                        data-original-title
                                                                        title
                                                                    >
                                                                        WholeSale
                                                                    </label>
                                                                </td>

                                                                <td
                                                                    style={{
                                                                        width: "100%",
                                                                    }}
                                                                >
                                                                    <div name="pricing">
                                                                        <div className="o_field_monetary o_field_number o_input o_field_widget oe_inline">
                                                                            <input
                                                                                className="o_inputs"
                                                                                placeholder
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                value={
                                                                                    wholeSaleVal
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    onInputChange(
                                                                                        e,
                                                                                        setWholeSaleVal
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </div>
                                            <div className="tab-bottomText">
                                                <Form.Group
                                                    className="mb-3"
                                                    controlId="exampleForm.ControlTextarea1"
                                                >
                                                    <Form.Label>
                                                        Sales Description
                                                    </Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        placeholder="This note is added to sales order and invoices"
                                                        value={descVal}
                                                        onChange={(e) =>
                                                            onInputChange(
                                                                e,
                                                                setDescVal
                                                            )
                                                        }
                                                    />
                                                </Form.Group>
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        value: state.srch.token,
    };
};

export default connect(mapStateToProps)(EditProduct);
