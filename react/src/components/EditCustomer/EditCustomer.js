import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Localbase from "localbase";
import { FaSave, FaCamera, FaSearch } from "react-icons/fa";
import "../../Assets/style/style.scss";
import Selector from "../UIComponents/Selector/Selector";
import History from "../../Navigation/History";
import { Col, Container, Row } from "react-bootstrap";
import Menu from "../Menu/Menu";

const EditCustomer = (props) => {
    let db = new Localbase("db");
    let { id } = useParams();

    const [nameVal, setNameVal] = useState([]);
    const [streetVal, setStreetVal] = useState("");
    const [cityVal, setCityVal] = useState("");
    const [postCodeVal, setPostCodeVal] = useState("");
    const [emailVal, setEmailVal] = useState([]);
    const [phoneVal, setPhoneVal] = useState();
    const [mounted, setMounted] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [countries, setCountries] = useState([]);
    const [countryChange, setCountryChange] = useState();
    const [languageChange, setLanguageChange] = useState();

    if (!mounted) {
        db.collection("language")
            .get()
            .then((data) => {
                setLanguages([
                    ...data.map((d) => ({
                        id: d.id,
                        value: d.name,
                    })),
                ]);
            })
            .then(() => {
                languages.length > 0
                    ? setLanguageChange(languages[0].id)
                    : setLanguageChange(1);
            });
        db.collection("country")
            .get()
            .then((data) => {
                setCountries([
                    ...data.map((d) => ({
                        id: d.id,
                        value: d.name,
                    })),
                ]);
            })
            .then(() => {
                countries.length > 0
                    ? setCountryChange(countries[0].id)
                    : setCountryChange(1);
            });

        db.collection("customers")
            .doc({ id: parseInt(id) })
            .get()
            .then((customers) => {
                console.log(customers, "dbbb");
                setNameVal(customers.first_name);
                setEmailVal(customers.email);
                setCityVal(customers.address.city);
                setPhoneVal(customers.address.phone_number);
                setStreetVal(customers.address.street_line_1);
                setPostCodeVal(customers.address.postal_code);
                setCountryChange(customers.address.core_country_id);
                setLanguageChange(customers.core_language_id);
            });
    }
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = (value, stateName) => {
        stateName(value);
    };

    const onInputChange = (e, stateName) => {
        stateName(e.target.value);
    };

    const EditCustomer = async () => {
        let response = await db
            .collection("customers")
            .doc({ id: parseInt(id) })
            .update({
                core_language_id: languageChange,
                first_name: nameVal,
                last_name: "",
                email: emailVal,
                password: "123",
                vat_number: "testt222",
                is_active: "1",
                is_deleted: "0",
                redirect_url: "",
                reset_email_timestamp: "",
                reset_password_token: "",
                reset_email_token: "",
                token_create_at: "",
                address: {
                    core_country_id: countryChange,
                    first_name: nameVal,
                    last_name: "",
                    company: "sudosol",
                    street_line_1: streetVal,
                    city: cityVal,
                    postal_code: postCodeVal,
                    phone_number: phoneVal,
                },
                sync: 0,
                sync_type: 2,
            });
        console.log(response.success, "responssssssseeeeee");
        if (response.success === true) {
            History.push("/customer");
        }
    };

    return (
        <Container fluid>
            <Row>
                <Menu />
                <Col xs="11">
                    <Row>
                        <div className="title-wrap">
                            <h1 className="Title">Edit Customers</h1>
                            <div className="search-box">
                                <input
                                    type="search"
                                    placeholder="Search Customers..."
                                />
                                <span className="icon">
                                    <FaSearch
                                        className="fa"
                                        aria-hidden="true"
                                    />
                                </span>
                            </div>
                        </div>
                    </Row>
                    <div className="screen-content">
                        <div className="top-content">
                            <div className="top-button" onClick={EditCustomer}>
                                <FaSave /> Save
                            </div>
                            <button
                                className="top-button"
                                onClick={() => History.push("/")}
                            >
                                Discard
                            </button>
                        </div>
                        <form className="client-details edit">
                            <div className="client-picture">
                                <i>
                                    <FaCamera className="fa" />
                                </i>
                            </div>
                            <input
                                placeholder="Name"
                                className="detail client-name"
                                value={nameVal}
                                onChange={(e) => onInputChange(e, setNameVal)}
                            />
                            <div className="client-details-box clearfix">
                                <div className="client-details-left">
                                    <div className="client-detail">
                                        <span className="label">Street</span>
                                        <input
                                            name="street"
                                            placeholder="Street"
                                            className="client-address-street"
                                            value={streetVal}
                                            onChange={(e) =>
                                                onInputChange(e, setStreetVal)
                                            }
                                        />
                                    </div>
                                    <div className="client-detail">
                                        <span className="label">City</span>
                                        <input
                                            name="city"
                                            placeholder="City"
                                            className="client-address-street"
                                            value={cityVal}
                                            onChange={(e) =>
                                                onInputChange(e, setCityVal)
                                            }
                                        />
                                    </div>
                                    <div className="client-detail">
                                        <span className="label">Postcode</span>
                                        <input
                                            name="zip"
                                            placeholder="ZIP"
                                            className="client-address-street"
                                            value={postCodeVal}
                                            onChange={(e) =>
                                                onInputChange(e, setPostCodeVal)
                                            }
                                        />
                                    </div>

                                    <div className="client-detail">
                                        <span className="label">Country</span>
                                        <Selector
                                            options={countries}
                                            value={countryChange}
                                            onChange={(event) => {
                                                handleChange(
                                                    event.target.value,
                                                    setCountryChange
                                                );
                                            }}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="client-details-right">
                                    <div className="client-detail">
                                        <span className="label">Language</span>
                                        <Selector
                                            options={languages}
                                            value={languageChange}
                                            onChange={(event) => {
                                                handleChange(
                                                    event.target.value,
                                                    setLanguageChange
                                                );
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className="client-detail">
                                        <span className="label">Email</span>
                                        <input
                                            name="email"
                                            class="client-address-street"
                                            value={emailVal}
                                            onChange={(e) =>
                                                onInputChange(e, setEmailVal)
                                            }
                                        />
                                    </div>
                                    <div class="client-detail">
                                        <span className="label">Phone</span>
                                        <input
                                            name="Phone"
                                            className="client-address-street"
                                            value={phoneVal}
                                            onChange={(e) =>
                                                onInputChange(e, setPhoneVal)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        value: state.srch.token,
        customerData: state.srch.customer_data,
    };
};

export default connect(mapStateToProps)(EditCustomer);
