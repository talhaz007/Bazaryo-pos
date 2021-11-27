import React, { useState, useEffect } from "react";
import "../../Assets/style/style.scss";
import { connect } from "react-redux";
import { FaExchangeAlt, FaSearch } from "react-icons/fa";
import Localbase from "localbase";
import { Form, Table, Tabs, Tab, Container, Row, Col } from "react-bootstrap";
import AvatarProvider from "../UIComponents/AvatarProvider/AvatarProvider";
import History from "../../Navigation/History";
import Selector from "../UIComponents/Selector/Selector";
import Menu from "../Menu/Menu";
import { useBarcode } from "react-barcodes";

const AddProduct = () => {
    let db = new Localbase("db");
    const [mounted, setMounted] = useState(false);
    const [titleVal, setTitleVal] = useState("");
    const [priceVal, setPriceVal] = useState("");
    const [barVal, setBarVal] = useState("");
    const [taxVal, setTaxVal] = useState("");
    const [descVal, setDescVal] = useState("");
    const [wholeSaleVal, setWholeSaleVal] = useState("");
    const [skuVal, setSkuVal] = useState("");
    const [quantityVal, setQuantityVal] = useState("");
    const [img, setImg] = useState("");
    const [key, setKey] = useState("General Information");
    const [category, setCategory] = useState([]);
    const [categoryChange, setCategoryChange] = useState();
    const [pImage, setPimage] = useState("");
    const [lastId, setLastId] = useState();

    const imageHandler = (e) => {
        const FR = new FileReader();
        const file = e.target.files[0];

        FR.addEventListener("load", (event) => {
            console.log("logoImage", event.target.result);
            setPimage(event.target.result);
        });

        console.log("logoImage2", file);

        FR.readAsDataURL(file);
        setPimage(file);

        const formData = new FormData();
        formData.append("file", file);
        console.log(formData, "form dataaa");
    };

    const onInputChange = (e, stateName) => {
        stateName(e.target.value);
    };
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
                setCategoryChange(data[0].id);
            });

        db.collection("products")
            .orderBy("id", "desc")
            .get()
            .then((data) => {
                if (data.length > 0) {
                    const idArray = data.map((d) => d.id);
                    const largestId = Math.max(...idArray);
                    setLastId(largestId);
                } else {
                    setLastId(0);
                }
            });
    }

    useEffect(() => {
        setMounted(true);
    }, []);
    const handleChange = (value, stateName) => {
        stateName(value);
    };

    const addproducts = () => {
        console.log(lastId, "lastid");
        db.collection("products")
            .add({
                id: lastId + 1,
                core_account_id: "1",
                core_marketplace_id: "1",
                core_product_type_id: 1,
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
                sync_type: 1,
            })
            .then(() => History.push("/"));
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
                            <h1 className="Title">Add Products</h1>
                        </div>
                    </Row>
                    <Row>
                        <div className="Head-card">
                            <div>
                                <p className="text-wraps">
                                    <span className="TopText-1">Products </span>
                                    <span className="Top-Text-2"> / </span>
                                    <span className="Top-Text-2"> New</span>
                                </p>
                                <div>
                                    <button
                                        type="button"
                                        className="button1"
                                        onClick={() => addproducts()}
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
                                            className="xs-3"
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
                                                                            type="number"
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
                                                                            maxLength="13"
                                                                            if="o_field_input_735"
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
                                                                                    type="number"
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
                                                                                    type="number"
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
                                                                                    type="number"
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
                    </Row>
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

export default connect(mapStateToProps)(AddProduct);
