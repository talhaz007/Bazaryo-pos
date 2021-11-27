import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Selector from "../UIComponents/Selector/Selector";
import Localbase from "localbase";
import { FaSave, FaCamera, FaSearch } from "react-icons/fa";
import "../../Assets/style/style.scss";
import History from "../../Navigation/History";
import { Container, Row, Col } from "react-bootstrap";
import Menu from "../Menu/Menu";

const AddCustomer = () => {
    const db = new Localbase("db");
    const [mounted, setMounted] = useState(false);
    const [nameVal, setNameVal] = useState("");
    const [streetVal, setStreetVal] = useState("");
    const [cityVal, setCityVal] = useState("");
    const [postCodeVal, setPostCodeVal] = useState("");
    const [emailVal, setEmailVal] = useState("");
    const [phoneVal, setPhoneVal] = useState("");
    const [languages, setLanguages] = useState([]);
    const [countries, setCountries] = useState([]);
    const [countryChange, setCountryChange] = useState();
    const [languageChange, setLanguageChange] = useState();
    const [lastId, setLastId] = useState();

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
            .orderBy("id", "desc")
            .get()
            .then((data) => {

                console.log(data, "dataaaaaa");
                if (data.length === 0) {
                    setLastId(1);
                } else {
                    setLastId(data[0].id);

                }
            });
    }
    useEffect(() => {
        setMounted(true);
    }, []);
    console.log(lastId, "lastidd");

    const handleChange = (value, stateName) => {
        stateName(value);
        console.log(value, "aaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    };

    const onInputChange = (e, stateName) => {
        stateName(e.target.value);
    };

    const onSubmitCustomer = () => {
        db.collection("customers")
            .add({
                id: lastId + 1,
                core_language_id: languageChange,
                first_name: nameVal,
                last_name: "xyz",
                email: emailVal,
                password: "123",
                vat_number: "testt222",
                is_active: "1",
                is_deleted: "0",
                redirect_url: "",
                reset_email_timestamp: "2021-09-02 14:28:36",
                reset_password_token: "",
                reset_email_token: "",
                token_create_at: "2021-09-02 14:28:36",
                address: {
                    core_country_id: countryChange,
                    first_name: nameVal,
                    last_name: "zzz",
                    company: "sudosol",
                    street_line_1: streetVal,
                    city: cityVal,
                    postal_code: postCodeVal,
                    phone_number: phoneVal,
                },
                sync: 0,
                sync_type: 1,
            })
            .then(History.push("/customer"));
    };

    return (
        <Container fluid>
            <Row>
                <Menu />
                <Col xs="11">
                    <div className="title-wrap">
                        <h1 className="Title">Add Customers</h1>
                        <div className="search-box">
                            <input
                                type="search"
                                placeholder="Search Customers..."
                            />
                            <span className="icon">
                                <FaSearch className="fa" aria-hidden="true" />
                            </span>
                        </div>
                    </div>
                    <div className="screen-content">
                        <div className="top-content">
                            <div
                                className="top-button"
                                onClick={() => onSubmitCustomer()}
                            >
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
                                name="name"
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
    };
};
export default connect(mapStateToProps)(AddCustomer);
