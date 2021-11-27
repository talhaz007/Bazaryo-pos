import React, { useState } from "react";
import { connect } from "react-redux";
import Logo from "../../Assets/img/logo.png";
import { Col, Container, Row } from "react-bootstrap";
import History from "../../Navigation/History";
import "./LogIn.scss";

function SignUp(props) {
    const [passVal, setPassVal] = useState();
    const [emailVal, setEmailVal] = useState();
    const [nameVal, setNameVal] = useState();
    const [nameVal1, setNameVal1] = useState();
    const [phoneVal, setPhoneVal] = useState();
    const [cityVal, setCityVal] = useState();
    const [streetVal, setStreetVal] = useState();
    const [companyVal, setCompanyVal] = useState();
    const [postVal, setPostVal] = useState();
    const [cnicVal, setCnicVal] = useState();

    const onInputChange = (value, stateName) => {
        stateName(value);
    };
    const onButtonClick = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Access-Control-Allow-Headers": "*",
                //'API-AUTH-TOKEN': "fd38b26f1a03d7d0dc1c8dcd44b1eb2138c359ed0e9f9b008bfadd1c69a10b4164d82935a8b3fe944a41fa916b9395abca1c7b67fca92acc3ad782878dc36b7c9b4622aea81284425c05cebc81a9d6bc7e0d0db04dd460f06e657f2fa767a1a8",
                "API-RESPONSE-FORMAT": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                core_account_id: 2,
                core_language_id: 1,
                is_deleted: 0,
                is_active: 1,
                first_name: nameVal,
                last_name: nameVal1,
                email: emailVal,
                password: passVal,
                company_name: companyVal,
                name: companyVal,
                street_line_1: streetVal,
                street_line_2: "",
                city: cityVal,
                postal_code: postVal,
                phone_number: phoneVal,
                cnic: cnicVal,
            }),
        };
        fetch(`${props.baseurl}/apis/users/add`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                window.location.assign("/");
            });
    };
    return (
        <Container fluid className="bg-style">
            <Row>
                <Col sm="12" className="d-flex">
                    <div className="reg-page">
                        <div className="regform">
                            <div className="form-heading ">
                                <h3 className="regText">SignUp</h3>
                            </div>
                            <div>
                                <div className="d-flex">
                                    <div className="inputflex-wrapper">
                                        <label className="form-label">
                                            <b style={{ color: "whitesmoke" }}>
                                                First Name
                                            </b>
                                        </label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={nameVal}
                                            onChange={(e) =>
                                                onInputChange(
                                                    e.target.value,
                                                    setNameVal
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex-wraper">
                                        <label className="form-label">
                                            <b style={{ color: "whitesmoke" }}>
                                                Last Name
                                            </b>
                                        </label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={nameVal1}
                                            onChange={(e) =>
                                                onInputChange(
                                                    e.target.value,
                                                    setNameVal1
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div className="inputflex-wrapper">
                                        <label className="form-label">
                                            <b style={{ color: "whitesmoke" }}>
                                                Company
                                            </b>
                                        </label>
                                        <input
                                            type="text"
                                            name="company_name"
                                            value={companyVal}
                                            onChange={(e) =>
                                                onInputChange(
                                                    e.target.value,
                                                    setCompanyVal
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex-wraper">
                                        <label className="form-label">
                                            <b style={{ color: "whitesmoke" }}>
                                                City
                                            </b>
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={cityVal}
                                            onChange={(e) =>
                                                onInputChange(
                                                    e.target.value,
                                                    setCityVal
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div className="inputflex-wrapper">
                                        <label className="form-label">
                                            <b style={{ color: "whitesmoke" }}>
                                                Phone
                                            </b>
                                        </label>
                                        <input
                                            type="text"
                                            name="phone_number"
                                            value={phoneVal}
                                            onChange={(e) =>
                                                onInputChange(
                                                    e.target.value,
                                                    setPhoneVal
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex-wraper">
                                        <label className="form-label">
                                            <b style={{ color: "whitesmoke" }}>
                                                CNIC
                                            </b>
                                        </label>
                                        <input
                                            type="text"
                                            name="phone_number"
                                            value={cnicVal}
                                            onChange={(e) =>
                                                onInputChange(
                                                    e.target.value,
                                                    setCnicVal
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div className="inputflex-wrapper">
                                        <label className="form-label">
                                            <b style={{ color: "whitesmoke" }}>
                                                Postal Code
                                            </b>
                                        </label>
                                        <input
                                            type="text"
                                            name="postal_code"
                                            value={postVal}
                                            onChange={(e) =>
                                                onInputChange(
                                                    e.target.value,
                                                    setPostVal
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex-wraper">
                                        <label className="form-label">
                                            <b style={{ color: "whitesmoke" }}>
                                                Address
                                            </b>
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={streetVal}
                                            onChange={(e) =>
                                                onInputChange(
                                                    e.target.value,
                                                    setStreetVal
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="mr">
                                    <label className="form-label mrright">
                                        <b style={{ color: "whitesmoke" }}>
                                            Email
                                        </b>
                                    </label>
                                    <input
                                        type="text"
                                        name="email"
                                        value={emailVal}
                                        onChange={(e) =>
                                            onInputChange(
                                                e.target.value,
                                                setEmailVal
                                            )
                                        }
                                    />
                                </div>
                                <div className="mr">
                                    <label className="form-label mright">
                                        <b style={{ color: "whitesmoke" }}>
                                            Password
                                        </b>
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={passVal}
                                        onChange={(e) =>
                                            onInputChange(
                                                e.target.value,
                                                setPassVal
                                            )
                                        }
                                    />
                                </div>
                                <button onClick={onButtonClick} type="button">
                                    Sign up
                                </button>
                                <div className="message-wrapper">
                                    <div
                                        className="message"
                                        onClick={() => History.push("/login")}
                                    >
                                        Already registered?
                                    </div>
                                    <hr className="hr-style" />
                                </div>
                                <div className="message-wrapper">
                                    <div className="message">
                                        Powered by Sudosol
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
const mapStateToProps = (state) => {
    return {
        token: state.srch.token,
        baseurl: state.srch.baseurl,
    };
};

export default connect(mapStateToProps)(SignUp);
