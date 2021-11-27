import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Localbase from "localbase";
import { useCookies } from "react-cookie";
import History from "../../Navigation/History";
import "./LogIn.scss";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { userId } from "../../store/actions";

const LogIn = (props) => {
    let bazaryo = new Localbase("db");
    const [customerSet, setCustomerSet] = useState(0);
    const [orderSet, setOrderSet] = useState(0);
    const [userSet, setUserSet] = useState(0);
    const [productSet, setProductSet] = useState(0);
    const [categoriesSet, setCategoriesSet] = useState(0);
    const [countrySet, setCountrySet] = useState(0);
    const [languagesSet, setLanguagesSet] = useState(0);
    const [categoriesData, setCategoriesData] = useState();
    const [languagesData, setLanguagesData] = useState();
    const [orderData, setOrderData] = useState();
    const [productData, setProductData] = useState();
    const [countriesData, setCountriesData] = useState();
    const [customersData, setCustomersData] = useState();
    const [passVal, setPassVal] = useState();
    const [emailVal, setEmailVal] = useState();
    const [active, setActive] = useState(true);
    const [cookies, setCookie] = useCookies(["userId"]);
    const [cookies1, setCookie1] = useCookies(["userToken"]);
    const [login, setLogin] = useState([]);
    const [userData, setUserData] = useState();
    const [tokenval, setTokenVal] = useState("");

    const onInputChange = (value, stateName) => {
        stateName(value);
    };

    console.log(tokenval, "tokennnnn");

    const onButtonClick = async () => {
        setActive(!active);
        const requestOptions = {
            method: "POST",
            headers: {
                "Access-Control-Allow-Headers": "*",
                "API-RESPONSE-FORMAT": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: emailVal,
                password: passVal,
            }),
        };

        fetch(`${props.baseurl}/apis/login`, requestOptions)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                props.onuserId(data.id);
                setTokenVal(data.token);
                setCookie("userId", data.id, { path: "/" });
                setCookie1("userToken", data.token, { path: "/" });
                if (!(data === "Invalid Email or Password")) {
                    //window.location.assign("/");
                }
                fetch(`${props.baseurl}/apis/users?id=${data.id}`, {
                    method: "GET",
                    headers: {
                        "API-AUTH-TOKEN": data.token,
                        "Access-Control-Allow-Headers": "*",
                        "API-RESPONSE-FORMAT": "application/json",
                        "Content-Type": "application/json",
                    },
                })
                    .then((res) => res.json())
                    .then((d) => {
                        console.log(d, "userdataaaa");
                        setUserData(d);
                    });
            });

        // let response2 = await fetch(`${props.baseurl}/apis/orders`, {
        //     method: "GET",
        //     headers: {
        //         "Access-Control-Allow-Headers": "*",
        //         "API-RESPONSE-FORMAT": "application/json",
        //         "Content-Type": "application/json",
        //     },
        // });
        // let data3 = await response2.json();
        // setOrderData(data3);
        // let response5 = await fetch(`${props.baseurl}/apis/languages`, {
        //     method: "GET",
        //     headers: {
        //         "Access-Control-Allow-Headers": "*",
        //         "API-RESPONSE-FORMAT": "application/json",
        //         "Content-Type": "application/json",
        //     },
        // });
        // let data = await response5.json();
        // setLanguagesData(data);

        // let response4 = await fetch(`${props.baseurl}/apis/countries`, {
        //     method: "GET",
        //     headers: {
        //         "Access-Control-Allow-Headers": "*",
        //         "API-RESPONSE-FORMAT": "application/json",
        //         "Content-Type": "application/json",
        //     },
        // });
        // let data1 = await response4.json();
        // setCountriesData(data1);

        // let response3 = await fetch(`${props.baseurl}/apis/customers`, {
        //     method: "GET",
        //     headers: {
        //         "API-AUTH-TOKEN": tokenval,
        //         "Access-Control-Allow-Headers": "*",
        //         "API-RESPONSE-FORMAT": "application/json",
        //         "Content-Type": "application/json",
        //     },
        // });
        // let data2 = await response3.json();
        // setCustomersData(data2);

        // let response1 = await fetch(`${props.baseurl}/apis/products`, {
        //     method: "GET",
        //     headers: {
        //         "Access-Control-Allow-Headers": "*",
        //         "API-RESPONSE-FORMAT": "application/json",
        //         "Content-Type": "application/json",
        //     },
        // });
        // let data4 = await response1.json();
        // setProductData(data4);

        // let response = await fetch(`${props.baseurl}/apis/categories`, {
        //     method: "GET",
        //     headers: {
        //         "Access-Control-Allow-Headers": "*",
        //         "API-RESPONSE-FORMAT": "application/json",
        //         "Content-Type": "application/json",
        //     },
        // });
        // let data5 = await response.json();
        // setCategoriesData(data5);
    };
    useEffect( async () => {
       if(tokenval){
        let response2 = await fetch(`${props.baseurl}/apis/orders`, {
            method: "GET",
            headers: {
                "API-AUTH-TOKEN": tokenval,
                "Access-Control-Allow-Headers": "*",
                "API-RESPONSE-FORMAT": "application/json",
                "Content-Type": "application/json",
            },
        });
        let data3 = await response2.json();
        setOrderData(data3);
        let response5 = await fetch(`${props.baseurl}/apis/languages`, {
            method: "GET",
            headers: {
                "API-AUTH-TOKEN": tokenval,
                "Access-Control-Allow-Headers": "*",
                "API-RESPONSE-FORMAT": "application/json",
                "Content-Type": "application/json",
            },
        });
        let data = await response5.json();
        setLanguagesData(data);

        let response4 = await fetch(`${props.baseurl}/apis/countries`, {
            method: "GET",
            headers: {
                "API-AUTH-TOKEN": tokenval,
                "Access-Control-Allow-Headers": "*",
                "API-RESPONSE-FORMAT": "application/json",
                "Content-Type": "application/json",
            },
        });
        let data1 = await response4.json();
        setCountriesData(data1);

        let response3 = await fetch(`${props.baseurl}/apis/customers`, {
            method: "GET",
            headers: {
                "API-AUTH-TOKEN": tokenval,
                "Access-Control-Allow-Headers": "*",
                "API-RESPONSE-FORMAT": "application/json",
                "Content-Type": "application/json",
            },
        });
        let data2 = await response3.json();
        setCustomersData(data2);

        let response1 = await fetch(`${props.baseurl}/apis/products`, {
            method: "GET",
            headers: {
                "API-AUTH-TOKEN": tokenval,
                "Access-Control-Allow-Headers": "*",
                "API-RESPONSE-FORMAT": "application/json",
                "Content-Type": "application/json",
            },
        });
        let data4 = await response1.json();
        setProductData(data4);

        let response = await fetch(`${props.baseurl}/apis/categories`, {
            method: "GET",
            headers: {
                "API-AUTH-TOKEN": tokenval,
                "Access-Control-Allow-Headers": "*",
                "API-RESPONSE-FORMAT": "application/json",
                "Content-Type": "application/json",
            },
        });
        let data5 = await response.json();
        setCategoriesData(data5);
    }
    }, [tokenval])

    useEffect(async () => {
        await bazaryo.collection("user").set(userData);
        setUserSet(1);
    }, [userData]);
    useEffect(async () => {
        await bazaryo.collection("language").set(languagesData);
        setLanguagesSet(1);
    }, [languagesData]);
    useEffect(async () => {
        await bazaryo.collection("country").set(countriesData);
        setCountrySet(1);
    }, [countriesData]);
    useEffect(async () => {
        await bazaryo.collection("products").set(productData);
        setProductSet(1);
    }, [productData]);
    useEffect(async () => {
        await bazaryo.collection("categories").set(categoriesData);
        setCategoriesSet(1);
    }, [categoriesData]);
    useEffect(async () => {
        await bazaryo.collection("orders").set(orderData);
        setOrderSet(1);
    }, [orderData]);
    useEffect(async () => {
        await bazaryo.collection("customers").set(customersData);
        setCustomerSet(1);
    }, [customersData]);

    useEffect(async () => {
        let data;
        await bazaryo
            .collection("customers")
            .get()
            .then((d) => (data = d));
        if (customerSet === 1) {
            if (customersData.length === data.length) {
                setLogin((prevState) => [...prevState, 1]);
            }
        }
    }, [customerSet]);
    useEffect(async () => {
        let data;
        await bazaryo
            .collection("orders")
            .get()
            .then((d) => (data = d));
        if (orderSet === 1) {
            if (orderData.length === data.length) {
                setLogin((prevState) => [...prevState, 1]);
            }
        }
    }, [orderSet]);
    useEffect(async () => {
        let data;
        await bazaryo
            .collection("categories")
            .get()
            .then((d) => (data = d));
        if (categoriesSet === 1) {
            if (categoriesData.length === data.length) {
                setLogin((prevState) => [...prevState, 1]);
            }
        }
    }, [categoriesSet]);
    useEffect(async () => {
        let data;
        await bazaryo
            .collection("products")
            .get()
            .then((d) => (data = d));
        if (productSet === 1) {
            if (productData.length === data.length) {
                setLogin((prevState) => [...prevState, 1]);
            }
        }
    }, [productSet]);
    useEffect(async () => {
        let data;
        await bazaryo
            .collection("country")
            .get()
            .then((d) => (data = d));
        if (countrySet === 1) {
            if (countriesData.length === data.length) {
                setLogin((prevState) => [...prevState, 1]);
            }
        }
    }, [countrySet]);
    useEffect(async () => {
        let data;
        await bazaryo
            .collection("language")
            .get()
            .then((d) => (data = d));
        if (languagesSet === 1) {
            if (languagesData.length === data.length) {
                setLogin((prevState) => [...prevState, 1]);
            }
        }
    }, [languagesSet]);

    useEffect(() => {
        if (login.length === 6) {
            let sum = 0;
            for (let i = 0; i < login.length; i++) {
                sum = sum + login[i];
            }
            if (login.length === sum) {
                window.location.assign("/");
            }
        }
    }, [login]);

    return (
        <Container fluid className="bg-style">
            <Row>
                <Col sm="12" className="d-flex">
                    <div className="login-page">
                        <div className="form">
                            <div className="form-heading ">
                                <h3>Login</h3>
                            </div>
                            <form className="login-form">
                                <label className="form-label">
                                    <b>Email</b>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Email"
                                    value={emailVal}
                                    onChange={(e) =>
                                        onInputChange(
                                            e.target.value,
                                            setEmailVal
                                        )
                                    }
                                />
                                <label>
                                    <b>Password</b>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={passVal}
                                    onChange={(e) =>
                                        onInputChange(
                                            e.target.value,
                                            setPassVal
                                        )
                                    }
                                />
                                {active ? (
                                    <button
                                        onClick={onButtonClick}
                                        type="button"
                                    >
                                        LOGIN
                                    </button>
                                ) : (
                                    <button
                                        onClick={onButtonClick}
                                        type="button"
                                    >
                                        <Spinner animation="border" />
                                    </button>
                                )}
                                <div className="margint">
                                    <div
                                        className="message"
                                        onClick={() => History.push("/signup")}
                                    >
                                        Don't have an account
                                    </div>
                                    <div
                                        className="message marginl"
                                        onClick={() => History.push("/reset")}
                                    >
                                        Reset Password
                                    </div>
                                </div>
                                <hr className="hr-style" />
                                <div className="mtop">
                                    <div className="message marginlr">
                                        Powered by Sudosol
                                    </div>
                                </div>
                            </form>
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
        baseurl: state.srch.baseurl,
        userId: state.srch.userId,
        token: state.srch.token,
    };
};
const mapDispatchToProps = (dispatch) => ({
    onuserId: (value) => dispatch(userId(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LogIn));
