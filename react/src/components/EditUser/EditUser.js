import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Container, Row, Col } from "react-bootstrap";
import { useCookies } from "react-cookie";
import Localbase from "localbase";
import Menu from "../Menu/Menu";
import History from "../../Navigation/History";
import "../../Assets/style/style.scss";

function EditUser(props) {
    let db = new Localbase("db");
    let { id } = useParams();
    const [cookies, setCookie] = useCookies(["userId"]);
    const [userData, setUserData] = useState([]);
    const [mounted, setMounted] = useState(false);
    const [passVal, setPassVal] = useState("");
    const [emailVal, setEmailVal] = useState("");
    const [nameVal, setNameVal] = useState();
    const [nameVal1, setNameVal1] = useState();
    const [phoneVal, setPhoneVal] = useState();
    const [cityVal, setCityVal] = useState();
    const [streetVal, setStreetVal] = useState();
    const [companyVal, setCompanyVal] = useState();
    const [postVal, setPostVal] = useState();
    const [cnicVal, setCnicVal] = useState();

    if (!mounted) {
        console.log(props.value, "tokennnnnnnnnnnn");
        // const requestOptions = {
        //     method: "GET",
        //     headers: {
        //         "Access-Control-Allow-Headers": "*",
        //         "API-RESPONSE-FORMAT": "application/json",
        //         "Content-Type": "application/json",
        //     },
        // };
        // fetch(
        //     `http://localhost:8765/apis/users?id=${cookies.userId}`,
        //     requestOptions
        // )
        //     .then((res) => res.json())
        //     .then((data) => {
        //         console.log(data, "dataaa");
        //         db.collection("users").set(data);
        //     });

        db.collection("user")
            .doc({ id: parseInt(cookies.userId) })
            .get()
            .then((user) => {
                console.log(user, "usersssddd");
                setUserData(user);
                setEmailVal(user.email);
                setNameVal(user.first_name);
                setNameVal1(user.last_name);
                setPhoneVal(user.phone_number);
                setCityVal(user.city);
                setStreetVal(user.street_line_1);
                setCompanyVal(user.company_name);
                setPostVal(user.postal_code);
                setCnicVal(user.cnic);
            });
    }
    useEffect(() => {
        setMounted(true);
    }, []);

    const onInputChange = (value, stateName) => {
        stateName(value);
    };

    const onUserEdit = () => {
        db.collection("user")
            .doc({ id: parseInt(cookies.userId) })
            .update({
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
                sync_type: 2,
            })
            .then(() => History.push("/"));
    };

    return (
        <Container fluid className="bgg-styles">
            <Row>
                <Menu />
                <Col xm="11">
                    <div className="title-wrap">
                        <h1 className="Title">Edit User</h1>
                    </div>
                    <div className="main-bg">
                        <div className="main-card">
                            <div className="form-wrap">
                                <form className="row">
                                    <div className="row-wrap">
                                        <div
                                            style={{
                                                display: "block",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <label
                                                className="form-label"
                                                htmlFor="Firstname"
                                            >
                                                First Name
                                            </label>

                                            <input
                                                type="text"
                                                name="Firstname"
                                                className="form-control"
                                                value={nameVal}
                                                placeholder="First Name"
                                                onChange={(e) =>
                                                    onInputChange(
                                                        e.target.value,
                                                        setNameVal
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="row-wrap">
                                        <div
                                            style={{
                                                display: "block",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <label
                                                className="form-label"
                                                htmlFor="LastName"
                                            >
                                                Last Name
                                            </label>

                                            <input
                                                type="text"
                                                name="LastName"
                                                className="form-control"
                                                value={nameVal1}
                                                placeholder="Last Name"
                                                onChange={(e) =>
                                                    onInputChange(
                                                        e.target.value,
                                                        setNameVal1
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </form>

                                <form className="row">
                                    <div className="row-wrap">
                                        <div
                                            style={{
                                                display: "block",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <label
                                                className="form-labels"
                                                htmlFor="company_name"
                                            >
                                                Company Name
                                            </label>

                                            <input
                                                type="text"
                                                name="company_name"
                                                className="form-control"
                                                value={companyVal}
                                                placeholder=""
                                                onChange={(e) =>
                                                    onInputChange(
                                                        e.target.value,
                                                        setCompanyVal
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="row-wrap">
                                        <div
                                            style={{
                                                display: "block",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <label
                                                className="form-labels"
                                                htmlFor="city"
                                            >
                                                City
                                            </label>

                                            <input
                                                type="text"
                                                name="city"
                                                className="form-control"
                                                value={cityVal}
                                                placeholder=""
                                                onChange={(e) =>
                                                    onInputChange(
                                                        e.target.value,
                                                        setCityVal
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </form>

                                <form className="row">
                                    <div className="row-wrap">
                                        <div
                                            style={{
                                                display: "block",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <label
                                                className="form-label"
                                                htmlFor="phone"
                                            >
                                                Phone
                                            </label>

                                            <input
                                                type="number"
                                                name="phone"
                                                className="form-control"
                                                value={phoneVal}
                                                placeholder=""
                                                onChange={(e) =>
                                                    onInputChange(
                                                        e.target.value,
                                                        setPhoneVal
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="row-wrap">
                                        <div
                                            style={{
                                                display: "block",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <label
                                                className="form-label"
                                                htmlFor="cnic"
                                            >
                                                CNIC
                                            </label>

                                            <input
                                                type="number"
                                                name="cnic"
                                                className="form-control"
                                                value={cnicVal}
                                                placeholder=""
                                                onChange={(e) =>
                                                    onInputChange(
                                                        e.target.value,
                                                        setCnicVal
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </form>

                                <form className="row">
                                    <div className="row-wrap">
                                        <div
                                            style={{
                                                display: "block",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <label
                                                className="form-label"
                                                htmlFor="postal_code"
                                            >
                                                Postal Code
                                            </label>

                                            <input
                                                type="number"
                                                name="postal_code"
                                                className="form-control"
                                                value={postVal}
                                                placeholder=""
                                                onChange={(e) =>
                                                    onInputChange(
                                                        e.target.value,
                                                        setPostVal
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="row-wrap">
                                        <div
                                            style={{
                                                display: "block",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <label
                                                className="form-labels"
                                                htmlFor="address"
                                            >
                                                Address
                                            </label>

                                            <input
                                                type="text"
                                                name="address"
                                                className="form-control"
                                                value={streetVal}
                                                placeholder=""
                                                onChange={(e) =>
                                                    onInputChange(
                                                        e.target.value,
                                                        setStreetVal
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </form>

                                <form className="row">
                                    <div className="row-wrap">
                                        <div
                                            style={{
                                                display: "block",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <label
                                                className="form-label"
                                                htmlFor="email"
                                            >
                                                Email
                                            </label>

                                            <input
                                                type="text"
                                                name="email"
                                                className="form-control"
                                                value={emailVal}
                                                placeholder=""
                                                onChange={(e) =>
                                                    onInputChange(
                                                        e.target.value,
                                                        setEmailVal
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    
                                </form>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <button
                                        className="top-button"
                                        onClick={onUserEdit}
                                    >
                                        Confirm <FaLongArrowAltRight />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
const mapStateTopProps = (state) => {
    return {
        token: state.srch.token,
    };
};

export default connect(mapStateTopProps)(EditUser);
